using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201605121221)]
    public class _201605121221_CertificationCategory : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_CertificationCategory_StateCEU_CategoryID]') AND parent_object_id = OBJECT_ID('dbo.[StateCEU]'))
                alter table dbo.[StateCEU]  drop constraint FK_CertificationCategory_StateCEU_CategoryID

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[CertificationCategory]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[CertificationCategory]

                create table dbo.[CertificationCategory] (
	                CertificationCategoryID UNIQUEIDENTIFIER not null,
                   [StateAbbr] NVARCHAR(255) null,
                   [Name] NVARCHAR(255) null,
                   [Number] NVARCHAR(255) null,
                   primary key (CertificationCategoryID)
                )
            ");

            this.Alter.Table("StateCEU").AddColumn("CategoryID").AsGuid().Nullable();

            this.Execute.Sql(@"
                alter table dbo.[StateCEU] 
	                add constraint FK_CertificationCategory_StateCEU_CategoryID 
	                foreign key (CategoryID) 
	                references dbo.[CertificationCategory]
            ");

            this.Execute.Sql(@"
                INSERT INTO CertificationCategory (CertificationCategoryID, StateAbbr, Number)
	                SELECT newid(), * FROM (SELECT DISTINCT StateAbbr, CategoryCode FROM StateCEU) x

                UPDATE s SET s.CategoryID = (SELECT TOP(1) CertificationCategoryID FROM CertificationCategory c WHERE s.StateAbbr = c.StateAbbr AND s.CategoryCode=c.Number) FROM StateCEU s
            ");

            this.Delete.Column("CategoryCode").FromTable("StateCEU");
        }

        public override void Down()
        {
        }
    }
}