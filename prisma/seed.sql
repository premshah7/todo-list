-- Insert default roles
INSERT INTO "Roles" ("RoleName") VALUES ('User') ON CONFLICT ("RoleName") DO NOTHING;
INSERT INTO "Roles" ("RoleName") VALUES ('Admin') ON CONFLICT ("RoleName") DO NOTHING;
INSERT INTO "Roles" ("RoleName") VALUES ('Manager') ON CONFLICT ("RoleName") DO NOTHING;
