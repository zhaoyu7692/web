#contest
CREATE TRIGGER contest_insert
    BEFORE INSERT
    ON contest
    FOR EACH ROW
BEGIN
    SET NEW.GMT_MODIFIED = NOW(), NEW.GMT_CREATED = NOW();
end;

CREATE TRIGGER contest_update
    BEFORE UPDATE
    ON contest
    FOR EACH ROW
BEGIN
    SET NEW.GMT_MODIFIED = NOW();
end;

#problem
CREATE TRIGGER problem_insert
    BEFORE INSERT
    ON problem
    FOR EACH ROW
BEGIN
    SET NEW.GMT_MODIFIED = NOW(), NEW.GMT_CREATED = NOW();
end;

CREATE TRIGGER problem_update
    BEFORE UPDATE
    ON problem
    FOR EACH ROW
BEGIN
    SET NEW.GMT_MODIFIED = NOW();
end;

#submit
CREATE TRIGGER submit_insert
    BEFORE INSERT
    ON submit
    FOR EACH ROW
BEGIN
    SET NEW.GMT_MODIFIED = NOW(), NEW.GMT_CREATED = NOW();
end;

CREATE TRIGGER submit_update
    BEFORE UPDATE
    ON submit
    FOR EACH ROW
BEGIN
    SET NEW.GMT_MODIFIED = NOW();
end;

#user
CREATE TRIGGER user_insert
    BEFORE INSERT
    ON user
    FOR EACH ROW
BEGIN
    SET NEW.LAST_MODIFIED = NOW(), NEW.GMT_MODIFIED = NOW(), NEW.GMT_CREATED = NOW();
end;

CREATE TRIGGER user_update
    BEFORE UPDATE
    ON user
    FOR EACH ROW
BEGIN
    SET NEW.LAST_MODIFIED = NOW(), NEW.GMT_MODIFIED = NOW();
end;