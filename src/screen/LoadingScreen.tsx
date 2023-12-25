import loadingImg from '../assets/loading.gif';

function LoadingScreen() {
  return <>
    <div className="card loading">
      <img src={loadingImg} alt="loading" />
    </div>
  </>;
}

export default LoadingScreen;
