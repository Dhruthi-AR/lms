import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Award, Download, Share2, CheckCircle2, Medal } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const MOCK_CERTIFICATES = [
  { id: 1, course: 'Python Tutorial for Beginners', date: 'Oct 24, 2026', certNo: 'PY-2026-X89C', hours: '6h 14m' },
  { id: 2, course: 'HTML & CSS Full Course - Beginner to Pro', date: 'Nov 12, 2026', certNo: 'HC-2026-B12A', hours: '6h 31m' }
];

const Certificates = () => {
  const { user } = useAuthStore();

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="text-primary-600" size={32} />
            My Certificates
          </h1>
          <p className="text-gray-600 mt-2">Download or share your earned course certificates.</p>
        </div>
      </div>

      {MOCK_CERTIFICATES.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <Medal size={36} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-500 max-w-sm mb-6">Complete courses to 100% to earn verified certificates to showcase on your profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {MOCK_CERTIFICATES.map((cert) => (
            <div key={cert.id} className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary-600"></div>
              
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center space-x-2">
                  <Award size={32} className="text-primary-600" />
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">SmartLearn AI</span>
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center border border-green-100">
                  <CheckCircle2 size={14} className="mr-1.5" />
                  Verified
                </div>
              </div>

              <div className="text-center mb-10">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3">Certificate of Completion</p>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{cert.course}</h2>
                <p className="text-gray-600 font-medium">Earned by <span className="text-primary-700 font-bold">{user?.name}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Issue Date</p>
                  <p className="text-sm font-bold text-gray-800">{cert.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Course Hours</p>
                  <p className="text-sm font-bold text-gray-800">{cert.hours}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Certificate ID</p>
                  <p className="text-sm font-mono font-bold text-gray-500">{cert.certNo}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-white border border-gray-200 text-gray-700 hover:text-primary-600 hover:border-primary-300 px-6 py-3 rounded-xl font-bold flex items-center justify-center transition shadow-sm hover:shadow">
                  <Download size={18} className="mr-2" />
                  Download PDF
                </button>
                <button className="flex-1 bg-primary-600 text-white hover:bg-primary-700 px-6 py-3 rounded-xl font-bold flex items-center justify-center transition shadow-sm">
                  <Share2 size={18} className="mr-2" />
                  Share to LinkedIn
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Certificates;
