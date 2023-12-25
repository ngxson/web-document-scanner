import { Document, Page, Image, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { IFile, useAppContext } from './AppContext';
import { useEffect, useState } from 'react';

let LAST_DOWNLOADED_PDF = '';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF'
  },
  section: {
    margin: 0,
    padding: 0,
  },
  img: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
});

const MyDocument = ({ files, token }: { files: IFile[], token: string }) => (
  <Document>
    {files.map(file => <Page size="A4" style={styles.page} key={file.name}>
      <View style={styles.section}>
        <Image src={`/view?file=${file.name}&token=${token}`} style={styles.section} />
      </View>
    </Page>)}
  </Document>
);

export function ExportAsPDF() {
  const { token, selectedFiles } = useAppContext();
  const [name, setName] = useState<string>('file');
  const [doc, setDoc] = useState<any>(null);

  // clear current document on new file selected
  useEffect(() => setDoc(null), [selectedFiles]);

  const doExport = () => {
    setName(`scan_${(new Date()).toISOString().replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    setDoc(<MyDocument files={selectedFiles} token={token} />);
  };

  if (selectedFiles.length === 0) return null;

  if (doc === null) {
    return <button className='btn btn-outline-primary' onClick={doExport}>
      Export selected as PDF
    </button>
  } else {
    return <PDFDownloadLink key="pdfURL" document={doc} fileName={name} className="btn btn-outline-primary url-download-pdf">
      {({ blob, url, loading }) => {
        if (!loading) {
          // auto download
          if (name !== LAST_DOWNLOADED_PDF) {
            try {
              console.log('Trigger download');
              LAST_DOWNLOADED_PDF = name;
              setTimeout(() => (document.getElementsByClassName('url-download-pdf')[0] as any).click(), 100);
            } catch (e) {
              // ignored
            }
          }
        }
        return loading ? 'Exporting to PDF...' : 'Click here to download PDF';
      }}
    </PDFDownloadLink>
  }
};
