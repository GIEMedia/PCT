using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201607061506)]
    public class _201607061506_RemoveFirstAttempt : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                IF EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[iSIRCAddUpdateAccount]'))
                ALTER TABLE Progress DISABLE TRIGGER [iSIRCRecordProgress]

                ALTER TABLE Progress DROP COLUMN FirstAttemptGrade

                IF EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[iSIRCAddUpdateAccount]'))
                ALTER TABLE Progress ENABLE TRIGGER [iSIRCRecordProgress]
                ");
        }

        public override void Down()
        {
        }
    }
}