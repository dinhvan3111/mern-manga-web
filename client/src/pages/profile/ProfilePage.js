import React from "react";
import BasicButton, { BUTTON_TYPE } from "../../components/button/BasicButton";
import { BsBookmark, BsFlag } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { PROFILE_ACTION } from "../../common/constants";
import { useSelector } from "react-redux";
import BasicTag from "../../components/tag/BasicTag";
import { userRoleToString } from "../../util/textHelper";

const actions = [
  {
    value: PROFILE_ACTION.FOLLOW,
    label: "Follow",
    icon: <BsBookmark />,
    disable: true,
    disableStyle: "!bg-orange-500 opacity-20 !text-white",
  },
  {
    value: PROFILE_ACTION.MESSAGE,
    label: "Message",
    icon: <CiMail />,
    disable: true,
    disableStyle: "!bg-gray-100 opacity-40",
  },
  {
    value: PROFILE_ACTION.REPORT,
    label: "Report",
    icon: <BsFlag />,
    disable: false,
  },
];

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="mt-20">
      <div className="h-52 w-full">
        <img
          className="w-full h-full object-cover"
          src="/images/default_profile_wall_paper.png"
          alt="img"
        />
      </div>
      <div className="px-16 py-4 relative">
        <div className="flex gap-4">
          <div className="basis-1/6">
            <div className="absolute h-52 w-52 rounded-full -top-24 border-2 border-white">
              <img
                className="w-full h-full object-cover rounded-full"
                src="/images/default_avt.png"
                alt="avt"
              />
            </div>
            <div className="mt-28 pr-4 flex flex-col gap-2">
              {actions.map((button) => (
                <BasicButton
                  key={button.value}
                  buttonType={BUTTON_TYPE.NO_COLOR}
                  className="h-12"
                  disabled={button?.disable}
                  disableStyle={button?.disableStyle}
                  icon={<BsFlag />}
                >
                  <span className="text-xl font-light">{button.label}</span>
                </BasicButton>
              ))}
            </div>
          </div>
          <div className="basis-5/6 ">
            <span className="font-bold text-4xl">{user?.data?.username}</span>
            <div className="mt-10">
              <span className="font-bold text-2xl">User ID</span>
              <div className="mt-4">
                <span className="text-lg">{user.data._id}</span>
              </div>
            </div>
            <div className="mt-10">
              <span className="font-bold text-2xl">Role</span>
              <div className="mt-4">
                <BasicTag
                  className="bg-gray-200 px-2 text-xl w-fit"
                  label={userRoleToString(user?.data.role)}
                  showStatusDot={true}
                  statusDotColor="!border-[1px] !border-black bg-white !h-4 !w-4"
                ></BasicTag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
