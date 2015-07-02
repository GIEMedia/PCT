using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201502171355)]
    public class _201502171355_ParentProgressID : Migration
    {
        public override void Up()
        {
            this.Alter.Table("Progress")
                .AddColumn("ParentProgressID")
                .AsGuid()
                .Nullable()
                .ForeignKey("FK_Progress_ParentProgress_ParentProgressID", "Progress", "ProgressID");
        }

        public override void Down()
        {
            
        }
    }
}