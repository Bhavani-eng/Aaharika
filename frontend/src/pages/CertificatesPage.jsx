import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiDownload, FiAward } from 'react-icons/fi';
import { DashboardLayout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { PageHeader, Grid } from '../components/ui/PageHeader';
import { PageLoader, EmptyState } from '../components/ui/Loading';
import { useAuth } from '../context/AuthContext';
import { certificateAPI } from '../services/api';
import { formatDate } from '../utils/constants';

const certTypes = {
  donor: { type: 'contribution', label: 'Contribution Certificate' },
  ngo: { type: 'service', label: 'Service Certificate' },
  volunteer: { type: 'volunteer', label: 'Volunteer Certificate' },
};

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    certificateAPI.getAll().then(({ data }) => setCertificates(data.data)).finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    const certConfig = certTypes[user?.role];
    if (!certConfig) return toast.error('Certificates not available for your role');
    setGenerating(true);
    try {
      await certificateAPI.generate(certConfig.type);
      toast.success('Certificate generated!');
      const { data } = await certificateAPI.getAll();
      setCertificates(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  const downloadCert = (cert) => {
    const content = `AAHARIKA - ${cert.title}\nCertificate ID: ${cert.certificateId}\nIssued to: ${cert.metadata?.userName || user?.name}\nDate: ${formatDate(cert.issuedAt)}\n${cert.description || ''}\nStats: ${JSON.stringify(cert.stats, null, 2)}`.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.certificateId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Certificates"
        subtitle="Celebrate and download your contribution achievements"
        action={certTypes[user?.role] && (
          <Button onClick={handleGenerate} loading={generating}>
            <FiAward className="h-4 w-4" /> Generate {certTypes[user.role].label}
          </Button>
        )}
      />

      {loading ? <PageLoader /> : certificates.length === 0 ? (
        <EmptyState icon={FiAward} title="No certificates yet" description="Generate a certificate to celebrate your impact!" />
      ) : (
        <Grid cols={2}>
          {certificates.map((c) => (
            <div key={c._id} className="card relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8" />
              <div className="relative flex-1">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Aaharika</p>
                <h3 className="text-h3 mt-2 mb-3">{c.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{c.description}</p>
                <div className="mt-4 space-y-1">
                  <p className="text-xs text-text-light font-mono">ID: {c.certificateId}</p>
                  <p className="text-xs text-text-light">Issued: {formatDate(c.issuedAt)}</p>
                </div>
                {c.stats && (
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border-light">
                    {c.stats.donationsCount != null && <span className="text-xs font-semibold bg-background px-2 py-1 rounded-lg">{c.stats.donationsCount} donations</span>}
                    {c.stats.mealsServed != null && <span className="text-xs font-semibold bg-background px-2 py-1 rounded-lg">{c.stats.mealsServed} meals</span>}
                    {c.stats.deliveriesCompleted != null && <span className="text-xs font-semibold bg-background px-2 py-1 rounded-lg">{c.stats.deliveriesCompleted} deliveries</span>}
                  </div>
                )}
              </div>
              <Button size="sm" variant="outline" className="mt-5 self-start" onClick={() => downloadCert(c)}>
                <FiDownload className="h-4 w-4" /> Download
              </Button>
            </div>
          ))}
        </Grid>
      )}
    </DashboardLayout>
  );
}
