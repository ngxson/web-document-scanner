import { useState } from 'react';
import { IFile, useAppContext } from '../AppContext';
import { ExportAsPDF } from '../PDF';
import loadingImg from '../assets/loading.gif';

function Loading() {
  return <div className="card loading">
    <img src={loadingImg} alt="loading" />
  </div>;
}

function MainScreen() {
  const { files, logout, isScanning, triggerScan } = useAppContext();
  const [blockScan, setBlockScan] = useState(false);

  const scan = async () => {
    setBlockScan(true);
    try {
      await triggerScan();
    } catch (e) {
      // ignored
    }
    setBlockScan(false);
  };

  if (files === null) return <Loading />;

  return <div className='row'>
    <div className='col col-12'>
      Actions:
      &nbsp;
      <button className='btn btn-primary' disabled={blockScan || isScanning} onClick={scan}>
        {isScanning ? 'Scan in progress...' : '+ Scan'}
      </button>
      &nbsp;&nbsp;
      <ExportAsPDF />
      &nbsp;&nbsp;
      |
      &nbsp;&nbsp;
      <button className='btn btn-outline-primary' onClick={logout}>
        Logout
      </button>
    </div>
    {files.map(f => <div className='col col-xs-12 col-sm-6 col-md-4 col-lg-3' key={f.name}>
      <FileCard file={f} />
    </div>)}
  </div>
}

function FileCard({ file }: { file: IFile }) {
  const { addSelectFile, removeSelectFile, selectedFiles, deleteFile, token } = useAppContext();
  const selectedIndex = selectedFiles.indexOf(file);
  const isSelected = selectedIndex !== -1;

  const toggleSelection = () => {
    if (isSelected) removeSelectFile(file);
    else addSelectFile(file);
  };

  const askDelete = () => {
    if (window.confirm('Are you sure to delete this scan?')) {
      deleteFile(file);
    }
  };

  return <div className={`card file ${isSelected ? 'selected' : ''}`}>
    {/* TODO: use thumbnail */}
    <img src={`/view?file=${file.name}&token=${token}`} onClick={() => {
      window.open(`/view?file=${file.name}&token=${token}`, '_blank')!.focus();
    }} />
    <div className='control'>
      <button className='btn btn-sm btn-outline-danger' disabled={isSelected} onClick={askDelete}>Delete</button>
      &nbsp;&nbsp;
      <button className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`} onClick={toggleSelection}>
        {isSelected ? `🗹 Unselect [${selectedIndex + 1}]` : 'Select'}
      </button>
      &nbsp;&nbsp;
      {!isSelected && <a href={`/download?file=${file.name}&token=${token}`} target='_blank' className='btn btn-sm btn-outline-success'>
        Save
      </a>}
    </div>
  </div>
}

export default MainScreen;
