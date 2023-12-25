'use client';

import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthState = 'loading' | 'loggedIn' | 'loggedOut';
export interface IFile {
  name: string,
  date: Date,
};

const agent = axios.create({
  validateStatus: () => true,
  headers: { 'x-token': localStorage.getItem('token') },
});

const AppContext = createContext<{
  auth: AuthState,
  login(password: string): Promise<boolean>,
  logout(): void,
  token: string,
  // list files
  files: IFile[],
  reloadFiles(): void,
  deleteFile(file: IFile): void,
  // selections
  selectedFiles: IFile[],
  addSelectFile(file: IFile): void,
  removeSelectFile(file: IFile): void,
  clearSelectFile(): void,
}>({} as any);

export const AppContextProvider = ({ children }: any) => {
  const [auth, setAuth] = useState<AuthState>('loading');
  const [files, setFiles] = useState<IFile[]>(null as any);
  const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
  const token = localStorage.getItem('token') || '';

  const login = async (password: string) => {
    const { data } = await agent.post('/login', { password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.reload();
      return true;
    } else {
      alert(data.error || 'Unknown error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth('loggedOut');
  };

  const reloadFiles = async () => {
    setFiles(null as any);
    const { data } = await agent.get('/files');
    if (data.error) {
      setAuth('loggedOut');
    } else {
      setAuth('loggedIn');
      setFiles(data.files);
    }
  };

  const deleteFile = async (file: IFile) => {
    setFiles(null as any);
    await agent.delete('/delete', {
      params: { file: file.name },
    });
    reloadFiles();
  };

  const addSelectFile = (file: IFile) => {
    if (selectedFiles.indexOf(file) === -1) {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const removeSelectFile = (file: IFile) => {
    setSelectedFiles(selectedFiles.filter(f => f !== file));
  };

  const clearSelectFile = () => {
    setSelectedFiles([]);
  };

  useEffect(() => {
    reloadFiles();
  }, []);

  return <AppContext.Provider
    value={{
      auth,
      login,
      logout,
      files,
      reloadFiles,
      deleteFile,
      selectedFiles,
      addSelectFile,
      removeSelectFile,
      clearSelectFile,
      token,
    }}
  >
    {children}
  </AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);