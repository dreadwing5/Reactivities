import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../models/profile";
import { observer } from "mobx-react-lite";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowing from "./ProfileFollowing";

import { useStore } from "../../stores/store";
import ProfileActivities from "./ProfileActivities";

interface Props {
  profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props) {
  const { profileStore } = useStore();
  const { setActiveTab } = profileStore;
  const panes = [
    {
      menuItem: "About",
      render: () => <ProfileAbout />,
    },
    { menuItem: "Photos", render: () => <ProfilePhotos profile={profile} /> },
    {
      menuItem: "Events",
      render: () => <ProfileActivities />,
    },
    {
      menuItem: "Followers",
      render: () => <ProfileFollowing />,
    },
    {
      menuItem: "Following",
      render: () => <ProfileFollowing />,
    },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(_, data) => setActiveTab(Number(data.activeIndex))}
    />
  );
});
