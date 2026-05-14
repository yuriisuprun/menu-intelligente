create schema if not exists auth;

create or replace function auth.uid()
returns uuid
language plpgsql
stable
as $$
declare
  claim_sub text;
  claims_json text;
  parsed_sub text;
begin
  claim_sub := nullif(current_setting('request.jwt.claim.sub', true), '');
  if claim_sub is not null then
    return claim_sub::uuid;
  end if;

  claims_json := nullif(current_setting('request.jwt.claims', true), '');
  if claims_json is null then
    return null;
  end if;

  parsed_sub := (claims_json::jsonb ->> 'sub');
  if parsed_sub is null or parsed_sub = '' then
    return null;
  end if;

  return parsed_sub::uuid;
exception
  when others then
    return null;
end;
$$;
