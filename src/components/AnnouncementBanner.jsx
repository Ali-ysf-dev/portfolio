export default function AnnouncementBanner() {
  return (
    <div
      id="announcement-banner"
      className="h-8 flex items-center justify-center font-bold text-sm transition-transform duration-300 ease-out"
      style={{ backgroundColor: '#FCA311', color: '#000000' }}
    >
      <p className="text-center px-4" style={{ color: '#000000' }}>
        New project launched! Check out our latest work.
      </p>
    </div>
  )
}
