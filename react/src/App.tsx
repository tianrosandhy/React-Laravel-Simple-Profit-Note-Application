import { useSelector } from 'react-redux';
import './App.css'
import Routes from "@/routes";
import {RootState} from "@/store";

function App() {
  const isLoading = useSelector((state:RootState) => state.loading.isLoading)
  return (
    <>
      <div className={`content-wrapper ${isLoading ? 'is-loading' : 'is-loaded'}`}>
        <div className="loading-screen bg-white w-full h-screen flex justify-center items-center fixed">
          <div>Loading...</div>
        </div>
        {Routes()}
      </div>
    </>
  )
}

export default App
