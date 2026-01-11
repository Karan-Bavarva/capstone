import UserMetaCard from "../../components/UserProfile/UserMetaCard";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import UserPasswordCard from "../../components/UserProfile/UserPasswordCard";
import UserKycCard from "../../components/UserProfile/UserKycCard";
import Page from "../../components/layout/common/Page";

export default function Profile() {
  return (
    <Page title="My Profile">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserPasswordCard />
          <UserKycCard />
        </div>
      </div>
    </Page>
  );
}
