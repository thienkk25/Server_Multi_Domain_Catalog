create or replace function approve_category_item_version(
  p_version_id uuid,
  p_user_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_version category_item_version;
  v_item    category_item;
  v_item_id uuid;
begin
  ------------------------------------------------------------------
  -- 1. Lock version đang pending
  ------------------------------------------------------------------
  select *
  into v_version
  from category_item_version
  where id = p_version_id
    and status = 'pending'
  for update;

  if not found then
    raise exception
      'Không tìm thấy phiên bản hoặc phiên bản không ở trạng thái pending';
  end if;

  ------------------------------------------------------------------
  -- 2. Apply change
  ------------------------------------------------------------------
  if v_version.change_type = 'create' then

    insert into category_item (
      group_id,
      code,
      name,
      description,
      status,
      image_url,
      created_by,
      created_at
    )
    values (
      (v_version.new_value->>'group_id')::uuid,
      v_version.new_value->>'code',
      v_version.new_value->>'name',
      v_version.new_value->>'description',
      (v_version.new_value->>'status')::category_item_status,
      v_version.new_value->>'image_url',
      v_version.change_by,
      now()
    )
    returning * into v_item;

    -- Gán item_id lại cho version
    update category_item_version
    set item_id = v_item.id
    where id = p_version_id;

  elsif v_version.change_type = 'update' then

    update category_item
    set
      code        = j.code,
      name        = j.name,
      description = j.description,
      group_id    = j.group_id,
      status      = j.status,
      image_url   = j.image_url,
      updated_by  = p_user_id,
      updated_at  = now()
    from jsonb_to_record(v_version.new_value) as j(
      code text,
      name text,
      description text,
      group_id uuid,
      status category_item_status,
      image_url text
    )
    where category_item.id = v_version.item_id;

    if not found then
      raise exception 'Không tìm thấy category_item để update';
    end if;

  elsif v_version.change_type = 'delete' then

    delete from category_item
    where id = v_version.item_id;

    if not found then
      raise exception 'Không tìm thấy category_item để delete';
    end if;

  else
    raise exception 'change_type không hợp lệ';
  end if;

  ------------------------------------------------------------------
  -- 3. Update version status -> approved
  ------------------------------------------------------------------
  update category_item_version
  set
    status      = 'approved',
    approved_by = p_user_id,
    applied_at  = now()
  where id = p_version_id;

  ------------------------------------------------------------------
  -- 4. Sync legal documents: version_legal_ref -> item_legal_ref
  ------------------------------------------------------------------
  v_item_id := coalesce(v_item.id, v_version.item_id);

  -- Bỏ qua nếu là delete (item đã bị xóa)
  if v_version.change_type != 'delete' then
    -- Xóa legal cũ của item
    delete from category_item_legal_ref
    where item_id = v_item_id;

    -- Copy legal từ version sang item
    insert into category_item_legal_ref (item_id, legal_id)
    select v_item_id, vlr.legal_id
    from category_item_version_legal_ref vlr
    where vlr.version_id = p_version_id;
  end if;

end;
$$;
