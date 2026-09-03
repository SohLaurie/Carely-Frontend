import React, { useState } from 'react';
import {
  Search, BookOpen, Briefcase, Heart, Award, ArrowUpRight,
  CheckCircle, PlusCircle, Bookmark, Share2, Compass, AlertCircle
} from 'lucide-react';

export default function ExploreTab() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'training'

  const jobOffers = [
    {
      id: 'J1',
      title: 'Home Care Nurse for Elderly Patient',
      location: 'Bastos, Yaoundé',
      salary: '4,000 XAF/hr',
      description: 'Seeking a compassionate registered nurse for post-surgical care and physical mobility assistance for a 74-year-old grandfather.',
      schedule: '3 days/week · 4 hours/session',
      posted: '2 hours ago',
      tags: ['Nursing', 'Elderly Care', 'Part-time']
    },
    {
      id: 'J2',
      title: 'Newborn Support & Night Nanny',
      location: 'Akwa, Douala',
      salary: '3,200 XAF/hr',
      description: 'Help needed with newborn night routines, feeding tracking, and nursery laundry. Experience with twins is a big plus.',
      schedule: 'Mon to Fri · 21:00 – 06:00',
      posted: '1 day ago',
      tags: ['Babysitting', 'Overnight', 'Newborn']
    },
    {
      id: 'J3',
      title: 'Post-Op Rehabilitation Assistant',
      location: 'Bonapriso, Douala',
      salary: '4,500 XAF/hr',
      description: 'Looking for a certified nursing provider to assist with medication admin, range-of-motion exercises, and vitals check.',
      schedule: 'Daily · 2 hours/session',
      posted: '3 days ago',
      tags: ['Post-Op', 'Vitals Tracking', 'Yaounde']
    },
    {
      id: 'J4',
      title: 'Weekend Companion & Housekeeper',
      location: 'Omnisports, Yaoundé',
      salary: '3,000 XAF/hr',
      description: 'Trusted companion needed for walks, conversations, meal preparation, and light home cleaning.',
      schedule: 'Sat & Sun · 6 hours/day',
      posted: '4 days ago',
      tags: ['Companion', 'Housekeeping', 'Weekend']
    }
  ];

  const trainingCourses = [
    {
      id: 'C1',
      title: 'Advanced Infant CPR & Choking Response',
      provider: 'Red Cross Cameroon',
      duration: '4 hours (Self-paced)',
      points: '15 CarePoints',
      status: 'Enrolled (65% done)',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&auto=format'
    },
    {
      id: 'C2',
      title: 'Geriatric Care & Alzheimer\'s Management',
      provider: 'Pan-African Health Alliance',
      duration: '10 hours',
      points: '30 CarePoints',
      status: 'Enrolled (20% done)',
      image: 'https://images.unsplash.com/photo-1582750433449-64c676f49dd1?w=400&h=300&fit=crop&auto=format'
    },
    {
      id: 'C3',
      title: 'Hygiene & Sanitization in Home Environments',
      provider: 'Ministry of Health Care',
      duration: '3 hours',
      points: '10 CarePoints',
      status: 'Completed ✓',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&auto=format'
    }
  ];

  const handleApply = (jobId) => {
    setAppliedJobs(prev => [...prev, jobId]);
    setSelectedJob(null);
  };

  const filteredJobs = jobOffers.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Header */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#1C1A17] font-display">Explore Hub</h2>
            <p className="text-xs text-[#8A7E74]">Discover active job opportunities and boost your skills with certified courses.</p>
          </div>
          
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
            <input
              type="text"
              placeholder="Search jobs, cities, or tags…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F5F2] border border-[#E2D9CF] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#1C1A17] placeholder:text-[#8A7E74] focus:outline-none focus:border-[#2D6A4F] transition-all"
            />
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mt-6 border-t border-[#F0EBE5] pt-4">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'bg-[#1E4030] text-white shadow-sm'
                : 'text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#F7F5F2]'
            }`}
          >
            <Briefcase size={13} />
            Provider Job Board ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'training'
                ? 'bg-[#1E4030] text-white shadow-sm'
                : 'text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#F7F5F2]'
            }`}
          >
            <BookOpen size={13} />
            Professional Training
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map(job => {
            const isApplied = appliedJobs.includes(job.id);
            return (
              <div
                key={job.id}
                className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm hover:border-[#2D6A4F] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-[#8A7E74] tracking-wider uppercase">
                        {job.posted}
                      </span>
                      <h3 className="font-bold text-sm md:text-base text-[#1C1A17] leading-snug">
                        {job.title}
                      </h3>
                    </div>
                    <span className="bg-emerald-50 text-[#1D6F42] border border-[#2D6A4F]/20 text-xs font-black px-2.5 py-1 rounded-xl whitespace-nowrap">
                      {job.salary}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#8A7E74]">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {job.schedule}
                    </span>
                  </div>

                  <p className="text-xs text-[#5A5248] leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-[#F7F5F2] text-[#5A5248] text-[9px] font-bold px-2 py-0.5 rounded-lg border border-[#E2D9CF]/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-[#F0EBE5] mt-4">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex-1 bg-[#FAF8F5] border border-[#E2D9CF] text-[#1C1A17] hover:bg-[#F7F5F2] text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => !isApplied && handleApply(job.id)}
                    disabled={isApplied}
                    className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isApplied
                        ? 'bg-emerald-50 border border-emerald-200 text-[#1D6F42] cursor-default'
                        : 'bg-[#1D6F42] hover:bg-[#155231] text-white shadow-sm'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle size={13} />
                        Applied
                      </>
                    ) : (
                      <>
                        Apply Now
                        <ArrowUpRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'training' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainingCourses.map(course => (
            <div
              key={course.id}
              className="bg-white border border-[#E2D9CF] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-xl">
                    {course.provider}
                  </div>
                </div>
                
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-sm text-[#1C1A17] leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#8A7E74] pt-2">
                    <span>⏱ {course.duration}</span>
                    <span className="text-[#1D6F42] font-semibold">{course.points}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-[#F0EBE5]/60 flex items-center justify-between">
                <span className="text-xs text-[#8A7E74] font-medium">{course.status}</span>
                {course.status.includes('Completed') ? (
                  <button className="text-xs font-bold text-[#1D6F42] underline cursor-pointer">
                    View Certificate
                  </button>
                ) : (
                  <button className="bg-[#1E4030] hover:bg-[#155231] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer">
                    Resume
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details modal popup */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] p-6 w-full max-w-lg space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <span className="bg-emerald-50 text-[#1D6F42] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#2D6A4F]/20">
                  {selectedJob.tags[0]}
                </span>
                <h3 className="font-bold text-lg text-[#1C1A17] leading-tight">
                  {selectedJob.title}
                </h3>
                <p className="text-xs text-[#8A7E74] flex items-center gap-1">
                  <MapPin size={12} />
                  {selectedJob.location} · {selectedJob.posted}
                </p>
              </div>
              <span className="text-base font-black text-[#1C1A17] whitespace-nowrap bg-[#F7F5F2] border border-[#E2D9CF] px-3.5 py-1.5 rounded-2xl">
                {selectedJob.salary}
              </span>
            </div>

            <div className="space-y-4 text-xs text-[#5A5248]">
              <div className="bg-[#F7F5F2] p-4 rounded-2xl border border-[#E2D9CF]/60 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase">Schedule</span>
                  <p className="font-semibold text-[#1C1A17] mt-0.5">{selectedJob.schedule}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase">Position Type</span>
                  <p className="font-semibold text-[#1C1A17] mt-0.5">{selectedJob.tags[2]}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#1C1A17]">Job Description</h4>
                <p className="leading-relaxed text-[#5A5248]">{selectedJob.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#1C1A17]">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 leading-relaxed pl-1 text-[#5A5248]">
                  <li>Certified nursing degree or clinical experience.</li>
                  <li>Clean criminal background check record on Carely.</li>
                  <li>Compassionate demeanor and reliable time management skills.</li>
                  <li>Ability to check in and check out using the Carely Mobile GPS system.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#F0EBE5]">
              <button
                onClick={() => setSelectedJob(null)}
                className="flex-1 px-4 py-3 border-2 border-[#E2D9CF] rounded-2xl text-xs font-semibold text-[#1C1A17] hover:bg-[#FAF8F5] transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleApply(selectedJob.id)}
                className="flex-1 px-4 py-3 bg-[#1D6F42] hover:bg-[#155231] text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
