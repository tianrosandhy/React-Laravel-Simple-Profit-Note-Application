import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import Header from "./components/Header";
import {useAuthHelper} from "@/utils/auth";
import useToastHelper from '@/utils/toast';
import * as Backend from '@/utils/backend';
import {logout} from "@/features/authtoken";
import {RootState} from "@/store";

// Your page components
import HomePage from './pages/HomePage';
import Guest from './pages/Guest';
import NotFoundPage from './pages/NotFoundPage';
import WalletPage from "./pages/WalletPage";
import LabelPage from "./pages/LabelPage";
import FormWalletPage from "./pages/WalletPage/FormWalletPage";
import FormLabelPage from "./pages/LabelPage/FormLabelPage";
import TransactionPage from "./pages/TransactionPage";
import TransactionRecordPage from "./pages/TransactionPage/TransactionRecordPage";
import { useDispatch } from "react-redux";

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuthHelper();
  const toast = useToastHelper();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.auth.token);

  // auth.storedToken must be verified first
  useEffect(() => {
    if (token.length > 0) {
      Backend.get({endpoint: "/auth/profile", useBearer: true, bearerToken: auth.storedToken}).then(resp => {
        if (resp?.type != "success") {
          dispatch(logout());
        }
      })
    }
  }, [token]);

  useEffect(() => {
    if (token.length == 0) {
      toast.errorToast("You need to login first");
      navigate('/');
    }
  }, [token])

  if (!auth.isLoggedIn) {
    toast.errorToast("You need to login first");
    navigate('/');
  }

  return children;
}

export default (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Guest />} />
      
      {/* protected route only if logged in */}
      <Route path="/dashboard" element={<RequireAuth><HomePage /></RequireAuth>} />
      <Route path="/wallet" element={<RequireAuth><WalletPage /></RequireAuth>} />
      <Route path="/wallet/new" element={<RequireAuth><FormWalletPage /></RequireAuth>} />
      <Route path="/wallet/detail/:id" element={<RequireAuth><FormWalletPage /></RequireAuth>} />
      <Route path="/label" element={<RequireAuth><LabelPage /></RequireAuth>} />
      <Route path="/label/new" element={<RequireAuth><FormLabelPage /></RequireAuth>} />
      <Route path="/label/detail/:id" element={<RequireAuth><FormLabelPage /></RequireAuth>} />
      <Route path="/transaction" element={<RequireAuth><TransactionPage /></RequireAuth>} />
      <Route path="/transaction/:id" element={<RequireAuth><TransactionPage /></RequireAuth>} />
      <Route path="/transaction/records" element={<RequireAuth><TransactionRecordPage /></RequireAuth>} />
      <Route path="/transaction/records/:id" element={<RequireAuth><TransactionRecordPage /></RequireAuth>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    {/* <Footer /> */}
  </Router>
);