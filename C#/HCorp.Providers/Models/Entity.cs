using HCorp.Status.Enum;
using System;

namespace HCorp.Providers.Models
{
    public class Entity
    {
        public Guid? Id { get; set; } = null;
        public string Name { get; set; }
        public string Url { get; set; }
        public string Avatar { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Culture { get; set; }
        public string Comment { get; set; }

        public string StatusId { get; set; }
        public string StatusName { get; internal set; }
        public string StatusDescription { get; set; }


        //public MODEL_STATE State { get; set; } = MODEL_STATE.NONE;
    }
}