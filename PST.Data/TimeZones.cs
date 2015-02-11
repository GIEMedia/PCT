using System;
using System.Collections.Generic;

namespace PST.Data
{
    public class TimeZones
    {
        public static Dictionary<string, TimeZoneInfo> TimeZonesByState = new Dictionary<string, TimeZoneInfo>
        {
            {"AK", TimeZoneInfo.FindSystemTimeZoneById("Alaskan Standard Time")},
            {"AL", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"AR", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"AZ", TimeZoneInfo.FindSystemTimeZoneById("U.S. Mountain Standard Time")},
            {"CA", TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time")},
            {"CO", TimeZoneInfo.FindSystemTimeZoneById("Mountain Standard Time")},
            {"CT", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"DC", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"DE", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"FL", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"GA", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"HI", TimeZoneInfo.FindSystemTimeZoneById("Hawaiian Standard Time")},
            {"IA", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"ID", TimeZoneInfo.FindSystemTimeZoneById("Mountain Standard Time")},
            {"IL", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"IN", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"KS", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"KY", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"LA", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"MA", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"MD", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"ME", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"MI", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"MN", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"MO", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"MS", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"MT", TimeZoneInfo.FindSystemTimeZoneById("Mountain Standard Time")},
            {"NC", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"ND", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"NE", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"NH", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"NJ", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"NM", TimeZoneInfo.FindSystemTimeZoneById("Mountain Standard Time")},
            {"NV", TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time")},
            {"NY", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"OH", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"OK", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"OR", TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time")},
            {"PA", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"RI", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"SC", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"SD", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"TN", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"TX", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"UT", TimeZoneInfo.FindSystemTimeZoneById("Mountain Standard Time")},
            {"VA", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"VT", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"WA", TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time")},
            {"WI", TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time")},
            {"WV", TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")},
            {"WY", TimeZoneInfo.FindSystemTimeZoneById("Mountain Standard Time")},
        };

        public class TimeZone
        {
            public TimeZone(string stateAbbr, string timeZone)
            {
                this.StateAbbr = stateAbbr;
                this.TimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
            }

            public string StateAbbr { get; set; }
            public TimeZoneInfo TimeZoneInfo { get; set; }
        }
    }
}
