using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201605210953)]
    public class _201605210953_CourseProgressAttempt : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                IF EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[iSIRCAddUpdateAccount]'))
                ALTER TABLE Progress DISABLE TRIGGER [iSIRCRecordProgress]

                UPDATE Progress SET Attempt = 1 WHERE Discriminator='CourseProgress' AND Attempt IS NULL

                IF EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[iSIRCAddUpdateAccount]'))
                ALTER TABLE Progress ENABLE TRIGGER [iSIRCRecordProgress]
                ");
        }

        public override void Down()
        {
        }
    }
}