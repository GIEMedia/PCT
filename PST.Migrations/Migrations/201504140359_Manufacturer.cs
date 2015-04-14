using FluentMigrator;

namespace PST.Migrations.Migrations
{
    [Migration(201504140359)]
    public class _201504140359_Manufacturer : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Manufacturer_Course_ManufacturerID]') AND parent_object_id = OBJECT_ID('dbo.[Course]'))
    alter table dbo.[Course]  drop constraint FK_Manufacturer_Course_ManufacturerID

if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Manufacturer]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Manufacturer]

create table dbo.[Manufacturer] (
    ManufacturerID UNIQUEIDENTIFIER not null,
    [Name] NVARCHAR(255) null,
    [ImageUrl] NVARCHAR(255) null,
    primary key (ManufacturerID)
)
");
            this.Alter.Table("Course").AddColumn("ManufacturerID").AsGuid().Nullable();

            this.Execute.Sql(@"
alter table dbo.[Course] 
    add constraint FK_Manufacturer_Course_ManufacturerID 
    foreign key (ManufacturerID) 
    references dbo.[Manufacturer]");
        }

        public override void Down()
        {
            this.Execute.Sql(@"
if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Manufacturer_Course_ManufacturerID]') AND parent_object_id = OBJECT_ID('dbo.[Course]'))
    alter table dbo.[Course]  drop constraint FK_Manufacturer_Course_ManufacturerID

if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Manufacturer]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Manufacturer]
");

            this.Delete.Column("ManufacturerID").FromTable("Course").InSchema("dbo");
        }
    }
}