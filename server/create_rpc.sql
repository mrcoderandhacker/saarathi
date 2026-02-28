CREATE OR REPLACE FUNCTION bypass_rls_insert_roadmap(
    p_user_id UUID,
    p_goal TEXT,
    p_curriculum JSONB
)
RETURNS JSON AS $$
DECLARE
    new_row roadmaps%ROWTYPE;
BEGIN
    INSERT INTO roadmaps (user_id, goal, curriculum)
    VALUES (p_user_id, p_goal, p_curriculum)
    RETURNING * INTO new_row;
    
    RETURN row_to_json(new_row);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
