-- Based on https://github.com/prisma/prisma/issues/15654#issuecomment-1267235883
create or replace function update_table_phrases_searchable() returns trigger as $$
begin
    NEW.searchable := to_tsvector(lang_to_regconfig(NEW.language),
                                  COALESCE(NEW.title, '') || ' ' || NEW."text" || ' ' || COALESCE(NEW."attribution", '')
        );

    RETURN NEW;
end; $$ language plpgsql security definer set search_path = public, pg_temp;

drop trigger if exists "update_searchable" on "phrases";
create trigger "update_searchable"
    before insert or update on "phrases"
    for each row
execute function update_table_phrases_searchable();