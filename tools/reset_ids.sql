-- Reset all AXIS IDs. Counter back to 0, all profiles cleared.
UPDATE id_counter SET current_value = 0;
UPDATE profiles SET axis_id = NULL;
