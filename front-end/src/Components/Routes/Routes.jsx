import MasterLayout from '../../MasterLayout.jsx';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import PageNotFound from '../PageNotFound/PageNotFound.jsx';
import Hero from '../Hero/Hero.jsx';
import AboutUs from '../About-Us/About-Us.jsx';
import Contactus from '../Contact-Us/Contactus.jsx';
import TermsAndConditions from '../Footer/Terms-and-Conditions/Terms-and-Conditions.jsx';
import PrivacyPolicy from '../Footer/Privacy-Policy/Privacy-Policy.jsx';
import SignIn from '../Sign-In/Sign-In.jsx';
import ForgotPassword from '../Forgot-Password/Forgot-Password.jsx';
import OTPPage from '../Forgot-Password/Otp-Page/Otp-Page.jsx';
import ResetPassword from '../Forgot-Password/ResetPassword.jsx';
import PasswordSuccess from '../Forgot-Password/Password-Sucess/Password-Sucess.jsx';
import SignUp from '../Sign-Up/Sign-Up.jsx';
import SideBarLayout from '../Dashboard/Side-Bar/Side-Bar-Layout.jsx';
import ProfilePage from '../Profile-Page/ProfilePage.jsx';
import Namuna7 from '../Dashboard/Namuna7/Namuna7.jsx';
import Application from '../Dashboard/ApplicationForWell/Application.jsx';
import NOCApplication from '../Dashboard/Noc/Noc.jsx';
import SubmittedForms from '../Submitted-Forms/SubmittedForms.jsx';
import Form12 from '../Dashboard/Form-12/Form12.jsx';
import AddUserForm from '../Admin/Manage-Users/ManageUser/AddUser.jsx';
import FarmDetails from '../Profile-Page/FarmProfile.jsx';
import ChangePassword from '../Change-Password/ChangePassword.jsx';
import ProtectedRoute from '../ProtectedRoute/protectedRoute.jsx';
import AddState from '../Admin/Manage-Locations/ManageState/ManageState.jsx';
import AddDistrict from '../Admin/Manage-Locations/ManageDistrict/ManageDistrict.jsx';
import AddSubDistrict from '../Admin/Manage-Locations/ManageSubDistrict/ManageSubDistrict.jsx';
import AddVillage from '../Admin/Manage-Locations/ManageVillage/ManageVillage.jsx';
import AddCanal from '../Admin/Manage-Locations/ManageCanals/ManageCanals.jsx';
import UsersList from '../Admin/Manage-Users/ManageUser/ViewUser.jsx';
import ThemeSettings from '../Theme-Settings/ThemeSettings.jsx';
import NocApplications from '../Approve-Deny/Noc/approve-deny-noc.jsx';
import ViewNoc from '../Approve-Deny/Noc/ViewNoc.jsx';
import ViewProfile from '../Admin/Manage-Users/ManageUser/ViewProfile.jsx';
import SubmittedNoc from '../Submitted-Forms/SubmittedNoc.jsx';
import SubmittedExemption from '../Submitted-Forms/SubmittedExemption.jsx';
import ExemptionApplications from '../Approve-Deny/Exemption/approve-deny-exemption.jsx';
import ViewExemption from '../Approve-Deny/Exemption/ViewExemption.jsx';
import NamunaApplications from '../Approve-Deny/Namuna7/approve-deny-namuna7.jsx';
import ViewNamuna7 from '../Approve-Deny/Namuna7/ViewNamuna7.jsx';
import SubmittedNamuna7 from '../Submitted-Forms/SubmittedNamuna7.jsx';
import ManageNamuna7 from '../Admin/Manage-Namuna7/ManageNamuna7.jsx';
import ApproveDenyForm12 from '../Approve-Deny/Form12/approve-deny-form12.jsx';
import Namuna7CApp from '../Approve-Deny/Form12/Namuna7CApp.jsx';

import TotalRatesByUser from '../Approve-Deny/Form12/MakePayment.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import PaymentsList from '../Approve-Deny/Form12/PaymentsList.jsx';
import ViewRateDetails from '../Approve-Deny/Form12/ViewRateDetails.jsx';
import ContactDetails from '../Admin/Manage-Contactus/ContactDetails.jsx';


const routermain = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MasterLayout />}>
      <Route path='' element={<Hero />} />
      <Route path='login-page' element={<SignIn />} />
      <Route path='sign-up' element={<SignUp />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='otp-page' element={<OTPPage />} />
      <Route path='reset-password/:token' element={<ResetPassword />} />
      <Route path='password-updated' element={<PasswordSuccess />} />
      <Route path='contact-us' element={<Contactus />} />
      <Route path='about-us' element={<AboutUs />} />
      <Route path='terms-and-condition' element={<TermsAndConditions />} />
      <Route path='privacy-policy' element={<PrivacyPolicy />} />
      <Route path="*" element={<PageNotFound />} />

      <Route path="side-bar" element={<ProtectedRoute />}>
        <Route path='' element={<SideBarLayout />}>
          <Route path="contact-us-dash" element={<Contactus />} />
          <Route path="namuna-7" element={<Namuna7 />} />
          <Route path="application" element={<Application />} />
          <Route path="noc" element={<NOCApplication />} />
          <Route path="submitted-forms" element={<SubmittedForms />} />
          <Route path="farm-profile" element={<FarmDetails />} />
          <Route path="personal-profile" element={<ProfilePage />} />
          <Route path="form12" element={<Form12 />} />
          <Route path="adduser" element={<AddUserForm />} />
          <Route path="add-state" element={<AddState />} />
          <Route path="add-district" element={<AddDistrict />} />
          <Route path="add-sub-district" element={<AddSubDistrict />} />
          <Route path="add-village" element={<AddVillage />} />
          <Route path="add-canal" element={<AddCanal />} />
          <Route path="view-users" element={<UsersList />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="theme-settings" element={<ThemeSettings />} />
          <Route path="approve-deny-noc" element={<NocApplications />} />
          <Route path="view-noc/:nocId" element={<ViewNoc />} />
          <Route path="view-profile/:userId" element={<ViewProfile />} />
          <Route path="submitted-noc" element={<SubmittedNoc />} />
          <Route path="submitted-exemption" element={<SubmittedExemption />} />
          <Route path="approve-deny-exemption" element={<ExemptionApplications />} />
          <Route path="view-exemption/:exemptionId" element={<ViewExemption />} />
          <Route path="view-namuna" element={<NamunaApplications />} />
          <Route path="view-namuna/:namuna_id" element={<ViewNamuna7 />} />
          <Route path="submitted-namuna7" element={<SubmittedNamuna7 />} />
          <Route path="manage-namuna" element={<ManageNamuna7 />} />
          <Route path="view-form12" element={<Namuna7CApp />} />
          <Route path="approve-deny-form12" element={<ApproveDenyForm12 />} />
          <Route path="payments" element={<TotalRatesByUser />} />
          <Route path="all-payments" element={<PaymentsList />} />          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="view/:id" element={<ViewRateDetails />} />
          <Route path="contactusdetails" element={<ContactDetails />} />
          
        </Route>
      </Route>
    </Route>
  )
);

export default routermain;
