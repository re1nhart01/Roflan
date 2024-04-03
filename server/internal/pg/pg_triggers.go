package pg

import "fmt"

const (
	UpdatedAtLabel = "updated_at"
	DeletedAtLabel = "deleted_at"
)

func TimestampUpdateTrigger(label string) string {
	return fmt.Sprintf(`CREATE OR REPLACE FUNCTION trigger_set_timestamp_%s()
		RETURNS TRIGGER AS $$
		BEGIN
		  NEW.%s = NOW();
		  RETURN NEW;
		END;
		$$ LANGUAGE plpgsql;
`, label, label)
}

func CreateTimestampTriggerOnTable(tableName, label string) string {
	return fmt.Sprintf(`CREATE OR REPLACE TRIGGER set_timestamp
		BEFORE UPDATE ON %s
		FOR EACH ROW
		EXECUTE PROCEDURE trigger_set_timestamp_%s();
`, tableName, label)
}
