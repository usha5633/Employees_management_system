// 'use client';

// import EmployeePageShell from '@/components/employee/EmployeePageShell';
// import { Bell, Search, Sparkles } from 'lucide-react';

// const announcements = [
//   { title: 'Team meeting', category: 'Meeting', date: 'Friday at 4:00 PM', priority: 'High', description: 'All engineering team members are requested to join the weekly sync.', status: 'Unread' },
//   { title: 'Company holiday', category: 'Holiday', date: '2 October 2026', priority: 'Medium', description: 'The office will remain closed on Gandhi Jayanti.', status: 'Read' },
//   { title: 'New HR policy update', category: 'HR Policy', date: '30 Sep 2026', priority: 'High', description: 'Updated leave and reimbursement guidelines will be effective from next month.', status: 'Unread' },
// ];

// export default function AnnouncementsPage() {
//   return (
//     <EmployeePageShell
//       title="Announcements"
//       subtitle="Stay informed with the latest updates and company notices."
//       actions={
//         <button className="inline-flex items-center gap-2 rounded-full border border-[#E7ECF5] bg-white px-4 py-2 text-[12px] font-semibold text-[#1E2A45] hover:bg-[#F3F7FF]">
//           <Bell className="h-4 w-4 text-[#3B6DF5]" />
//           Mark all as read
//         </button>
//       }
//     >
//       <div className="mb-6 rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           <div className="flex items-center gap-3 rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 md:w-[420px]">
//             <Search className="h-4 w-4 text-[#7581A3]" />
//             <input className="w-full border-none bg-transparent text-[13px] outline-none placeholder:text-[#7E8AA7]" placeholder="Search announcements" />
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {['All', 'General', 'HR Policy', 'Meeting', 'Holiday', 'Important Notice'].map((item) => (
//               <button key={item} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${item === 'All' ? 'bg-[#EAF0FF] text-[#3B6DF5]' : 'border border-[#E7ECF5] bg-white text-[#53627F]'}`}>
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {announcements.map((item) => (
//           <div key={item.title} className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
//             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//               <div className="flex gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
//                   <Sparkles className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="flex flex-wrap items-center gap-2">
//                     <h3 className="text-[18px] font-bold text-[#1E2A45]">{item.title}</h3>
//                     <span className="rounded-full bg-[#EAF0FF] px-2 py-1 text-[10px] font-bold text-[#3B6DF5]">{item.category}</span>
//                     <span className="rounded-full bg-[#FFF3D8] px-2 py-1 text-[10px] font-bold text-[#C98900]">{item.priority}</span>
//                   </div>
//                   <div className="mt-1 text-[12px] text-[#7581A3]">{item.date}</div>
//                 </div>
//               </div>

//               <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${item.status === 'Unread' ? 'bg-[#EAF0FF] text-[#3B6DF5]' : 'bg-[#EAF7EE] text-[#1DAA6E]'}`}>
//                 {item.status}
//               </span>
//             </div>

//             <p className="mt-4 text-[13px] leading-6 text-[#53627F]">{item.description}</p>

//             <div className="mt-4 flex justify-end">
//               <button className="rounded-full bg-[#3B6DF5] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2F5FE7]">
//                 View details
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </EmployeePageShell>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { Bell, Search, Sparkles, Loader2 } from 'lucide-react';

type Announcement = {
  _id: string;
  title: string;
  category: string;
  date: string;
  priority: string;
  description: string;
  status: 'Unread' | 'Read';
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  async function fetchAnnouncements() {
    try {
      setLoading(true);

      const response = await fetch('/api/v1/announcements');
      const data = await response.json();

      if (response.ok && data.success) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function markAllAsRead() {
    try {
      setMarkingAll(true);

      const response = await fetch(
        '/api/v1/announcements/read-all',
        {
          method: 'PATCH',
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setAnnouncements((previous) =>
          previous.map((item) => ({
            ...item,
            status: 'Read',
          }))
        );
      }
    } catch (error) {
      console.error('Failed to mark announcements as read:', error);
    } finally {
      setMarkingAll(false);
    }
  }

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === 'All' || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <EmployeePageShell
      title="Announcements"
      subtitle="Stay informed with the latest updates and company notices."
      actions={
        <button
          onClick={markAllAsRead}
          disabled={markingAll}
          className="inline-flex items-center gap-2 rounded-full border border-[#E7ECF5] bg-white px-4 py-2 text-[12px] font-semibold text-[#1E2A45] hover:bg-[#F3F7FF] disabled:opacity-60"
        >
          {markingAll ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#3B6DF5]" />
          ) : (
            <Bell className="h-4 w-4 text-[#3B6DF5]" />
          )}

          Mark all as read
        </button>
      }
    >
      <div className="mb-6 rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3 rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 md:w-[420px]">
            <Search className="h-4 w-4 text-[#7581A3]" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none bg-transparent text-[13px] outline-none placeholder:text-[#7E8AA7]"
              placeholder="Search announcements"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'All',
              'General',
              'HR Policy',
              'Meeting',
              'Holiday',
              'Important Notice',
            ].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  category === item
                    ? 'bg-[#EAF0FF] text-[#3B6DF5]'
                    : 'border border-[#E7ECF5] bg-white text-[#53627F]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B6DF5]" />
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="rounded-[20px] border border-[#E7ECF5] bg-white p-10 text-center text-[#7581A3]">
          No announcements found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((item) => (
            <div
              key={item._id}
              className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div className="flex gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[18px] font-bold text-[#1E2A45]">
                        {item.title}
                      </h3>

                      <span className="rounded-full bg-[#EAF0FF] px-2 py-1 text-[10px] font-bold text-[#3B6DF5]">
                        {item.category}
                      </span>

                      <span className="rounded-full bg-[#FFF3D8] px-2 py-1 text-[10px] font-bold text-[#C98900]">
                        {item.priority}
                      </span>
                    </div>

                    <div className="mt-1 text-[12px] text-[#7581A3]">
                      {item.date}
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    item.status === 'Unread'
                      ? 'bg-[#EAF0FF] text-[#3B6DF5]'
                      : 'bg-[#EAF7EE] text-[#1DAA6E]'
                  }`}
                >
                  {item.status}
                </span>

              </div>

              <p className="mt-4 text-[13px] leading-6 text-[#53627F]">
                {item.description}
              </p>

              <div className="mt-4 flex justify-end">
                <button className="rounded-full bg-[#3B6DF5] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2F5FE7]">
                  View details
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </EmployeePageShell>
  );
}