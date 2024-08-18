using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfile : Profile
    {

        public MappingProfile()
        {
            // Maps Activity Request -> Activity Entity
            CreateMap<Activity, Activity>();
        }

    }
}