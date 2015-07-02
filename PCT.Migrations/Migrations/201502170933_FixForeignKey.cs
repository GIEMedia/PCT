using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201502170933)]
    public class _201502170933_FixForeignKey : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Question_QuestionProgress_ItemID]') AND parent_object_id = OBJECT_ID('dbo.[Progress]'))
                alter table dbo.[Progress]  drop constraint FK_Question_QuestionProgress_ItemID
            ");
        }

        public override void Down()
        {
            
        }
    }
}