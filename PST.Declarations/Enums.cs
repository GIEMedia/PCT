using System;

namespace PST.Declarations
{
    [Flags]
    public enum AdminAccess
    {
        None = 0,
        System = 1,
    }

    [Flags]
    public enum CourseStatus
    {
        Draft = 0,
        CourseReviewed = 1,
        TestReviewed = 2,
        Approved = 4,
        Active = CourseReviewed | TestReviewed | Approved
    }
}