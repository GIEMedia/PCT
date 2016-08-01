using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201605310856)]
    public class _201605310856_TestProgressFirstAttemptGrade : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                IF EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[iSIRCAddUpdateAccount]'))
                ALTER TABLE Progress DISABLE TRIGGER [iSIRCRecordProgress]

                ALTER TABLE Progress ADD FirstAttemptGrade decimal(19, 5) NULL

                IF EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[iSIRCAddUpdateAccount]'))
                ALTER TABLE Progress ENABLE TRIGGER [iSIRCRecordProgress]
                ");
        }

        public override void Down()
        {
        }
    }
}