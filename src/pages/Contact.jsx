import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';

export default function Contact() {
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ type: 'success', message: 'Your message has been sent. We\'ll respond shortly.' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Get in touch</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3">Questions about the platform or a specific land record? Reach out.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-primary"><Mail size={18} /></div>
              <div><p className="text-sm font-medium">Email</p><p className="text-sm text-slate-500 dark:text-slate-400">support@landchain.gov.in</p></div>
            </Card>
            <Card className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-primary"><Phone size={18} /></div>
              <div><p className="text-sm font-medium">Phone</p><p className="text-sm text-slate-500 dark:text-slate-400">+91 522 100 2026</p></div>
            </Card>
            <Card className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-primary"><MapPin size={18} /></div>
              <div><p className="text-sm font-medium">Office</p><p className="text-sm text-slate-500 dark:text-slate-400">Lucknow, Uttar Pradesh</p></div>
            </Card>
            <Card className="overflow-hidden h-40 flex items-center justify-center text-slate-400 text-sm" hover={false}>
              Google Map placeholder
            </Card>
          </div>

          <Card className="p-6 lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name</label>
                  <input required className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input required type="email" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subject</label>
                <input required className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message</label>
                <textarea required rows={5} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary" />
              </div>
              <Button type="submit" size="lg">Send Message</Button>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
      <Toast toast={toast} />
    </div>
  );
}
