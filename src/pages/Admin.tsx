import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, LogOut, Edit, Save, X, Upload, Eye, EyeOff, MessageCircle, Check, Search } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

type ContentItem = {
  id: number;
  section: string;
  title: string | null;
  description: string | null;
  media_url: string | null;
  media_type: string | null;
  link_url: string | null;
  category: string | null;
  display_order: number;
  is_active: boolean;
};

type Inquiry = {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  event_type: string | null;
  message: string;
  is_contacted: boolean;
  created_at: string;
};

type SeoSetting = {
  id: number;
  page: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
};

const SECTIONS = [
  { key: "work_albums", label: "\uD83C\uDFB5 Albums", type: "content" },
  { key: "work_films", label: "\uD83C\uDFAC Films", type: "content" },
  { key: "work_weddings", label: "\uD83D\uDC8D Weddings", type: "content" },
  { key: "services", label: "\uD83C\uDFA5 Services", type: "content" },
  { key: "hero", label: "\uD83C\uDFE0 Hero", type: "content" },
  { key: "featured_film", label: "\u2B50 Featured Film", type: "content" },
  { key: "about", label: "\u2139\uFE0F About", type: "content" },
  { key: "actress_showreel", label: "\uD83C\uDFAC Actress Showreels", type: "content" },
  { key: "actress_gallery", label: "\uD83D\uDCF8 Actress Gallery", type: "content" },
  { key: "inquiries", label: "\uD83D\uDCEC Inquiries", type: "inquiries" },
  { key: "seo", label: "\uD83D\uDD0D SEO Settings", type: "seo" },
];

const SECTION_HINTS: Record<string, string> = {
  featured_film: "This controls the Featured Release video on the homepage. Add ONE item with a YouTube URL.",
  actress_showreel: "Add YouTube video URLs here for the Actress page showreel section.",
  actress_gallery: "Upload photos here for the Actress page gallery.",
  work_albums: "Add music album entries with YouTube URLs or images.",
  work_films: "Add film entries with YouTube URLs.",
  work_weddings: "Add wedding entries with images or YouTube links.",
  hero: "Manage the homepage hero/banner section.",
  about: "Manage the About page content.",
  services: "Manage the services listed on the Services page.",
};

/* Helper: extract YouTube video ID from a URL */
const extractYouTubeId = (url: string | null): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
};

/* Helper: check if URL is a YouTube link */
const isYouTubeUrl = (url: string | null): boolean =>
  !!url && (url.includes('youtube.com') || url.includes('youtu.be'));

/* Helper: get the best preview image for a content item */
const getPreviewImage = (item: ContentItem): string | null => {
  if (!item.media_url) return null;
  if (item.media_type === 'youtube' || isYouTubeUrl(item.media_url)) {
    const videoId = extractYouTubeId(item.media_url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  }
  return item.media_url;
};

const Admin = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [seoSettings, setSeoSettings] = useState<SeoSetting[]>([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ContentItem>>({});
  const [seoEditPage, setSeoEditPage] = useState<string | null>(null);
  const [seoForm, setSeoForm] = useState<Partial<SeoSetting>>({});
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getToken = () => localStorage.getItem("mg_admin_token");

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`,
  }), []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const section = SECTIONS.find((s) => s.key === activeSection);
    if (section?.type === "content") fetchContent();
    if (section?.type === "inquiries") fetchInquiries();
    if (section?.type === "seo") fetchSeo();
  }, [activeSection]);

  const checkAuth = async () => {
    const token = getToken();
    if (!token) { navigate("/admin/login"); return; }

    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) { navigate("/admin/login"); return; }
    } catch {
      // If server is not running, allow access for demo mode
      console.warn("API not reachable, running in demo mode");
    }
    setLoading(false);
  };

  const fetchContent = async () => {
    try {
      const section = activeSection === "content" ? "" : activeSection;
      const url = section
        ? `${API_URL}/api/content/all?section=${section}`
        : `${API_URL}/api/content/all`;
      const res = await fetch(url, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch {
      // Demo mode — use empty
      setContent([]);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch {
      setInquiries([]);
    }
  };

  const fetchSeo = async () => {
    try {
      const res = await fetch(`${API_URL}/api/seo`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSeoSettings(data);
      }
    } catch {
      setSeoSettings([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mg_admin_token");
    localStorage.removeItem("mg_admin_user");
    navigate("/admin/login");
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_URL}/api/content`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          section: activeSection,
          title: "",
          description: "",
          display_order: content.length,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast({ title: "Added! Fill in the details below." });
        await fetchContent();
        // Auto-open the edit form for the newly created item
        const newId = data.id;
        if (newId) {
          setEditingId(newId);
          setEditForm({
            id: newId,
            section: activeSection,
            title: "",
            description: "",
            media_url: null,
            media_type: 'image',
            link_url: null,
            category: null,
            display_order: content.length,
            is_active: true,
          });
        }
      }
    } catch {
      toast({ title: "Error", description: "Could not add item", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/api/content/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        toast({ title: "Deleted!" });
        fetchContent();
      }
    } catch {
      toast({ title: "Error", description: "Could not delete", variant: "destructive" });
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`${API_URL}/api/content/${editingId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingId(null);
        toast({ title: "Saved!" });
        fetchContent();
      }
    } catch {
      toast({ title: "Error", description: "Could not save", variant: "destructive" });
    }
  };

  const handleContactToggle = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_URL}/api/inquiries/${id}/contacted`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ is_contacted: !currentStatus }),
      });
      if (res.ok) {
        toast({ title: currentStatus ? "Unmarked" : "Marked as contacted" });
        fetchInquiries();
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!window.confirm("Delete this inquiry? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/api/inquiries/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        toast({ title: "Deleted!" });
        fetchInquiries();
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleSeoEdit = (seo: SeoSetting) => {
    setSeoEditPage(seo.page);
    setSeoForm(seo);
  };

  const handleSeoSave = async () => {
    if (!seoEditPage) return;
    try {
      const res = await fetch(`${API_URL}/api/seo/${seoEditPage}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(seoForm),
      });
      if (res.ok) {
        setSeoEditPage(null);
        toast({ title: "SEO settings saved!" });
        fetchSeo();
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const currentSectionConfig = SECTIONS.find((s) => s.key === activeSection);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground font-body">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-display text-gradient-gold">MG Films Admin</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-1.5 text-xs font-body border border-border rounded-sm text-foreground hover:border-gold/30 transition-colors"
          >
            View Site
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border bg-card p-3 md:min-h-[calc(100vh-52px)]">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-body">Sections</p>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => { setActiveSection(s.key); setEditingId(null); setSeoEditPage(null); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors font-body ${activeSection === s.key ? "bg-primary/20 text-primary" : "text-foreground hover:bg-muted"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Content Management */}
          {currentSectionConfig?.type === "content" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display text-foreground">{currentSectionConfig.label}</h2>
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-body bg-gradient-gold text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>

              {SECTION_HINTS[activeSection] && (
                <p className="text-muted-foreground text-xs font-body mb-4 bg-primary/5 border border-gold/10 rounded-sm px-3 py-2">
                  💡 {SECTION_HINTS[activeSection]}
                </p>
              )}

              {content.length === 0 && (
                <p className="text-muted-foreground text-sm font-body">No items yet. Click "Add Item" to start.</p>
              )}

              <div className="space-y-3">
                {content.map((item) => (
                  <div key={item.id} className="bg-card border border-border rounded-lg p-4">
                    {editingId === item.id ? (
                      <div className="space-y-3">
                        <input
                          placeholder="Title"
                          value={editForm.title || ""}
                          onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                          className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary/50"
                        />
                        <textarea
                          placeholder="Description"
                          rows={3}
                          value={editForm.description || ""}
                          onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                          className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary/50 resize-none"
                        />
                        <div className="flex gap-2 items-end">
                          <input
                            placeholder="Media URL (or upload below)"
                            value={editForm.media_url || ""}
                            onChange={(e) => {
                              const url = e.target.value;
                              const isYT = url.includes('youtube.com') || url.includes('youtu.be');
                              setEditForm((p) => ({ ...p, media_url: url, ...(isYT ? { media_type: 'youtube' } : {}) }));
                            }}
                            className="flex-1 bg-secondary border border-border rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary/50"
                          />
                          <label className={`flex items-center gap-1 px-3 py-2 text-xs font-body border border-gold/30 text-primary rounded-sm cursor-pointer hover:bg-primary/10 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Upload className="w-3.5 h-3.5" />
                            {uploading ? "Uploading..." : "Upload"}
                            <input
                              type="file"
                              accept="image/*,video/mp4,video/webm"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploading(true);
                                try {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('folder', activeSection);
                                  const res = await fetch(`${API_URL}/api/upload`, {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${getToken()}` },
                                    body: formData,
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    setEditForm((p) => ({ ...p, media_url: data.url }));
                                    toast({ title: 'Uploaded!', description: file.name });
                                  } else {
                                    toast({ title: 'Upload failed', variant: 'destructive' });
                                  }
                                } catch {
                                  toast({ title: 'Upload error', description: 'Check R2 config', variant: 'destructive' });
                                }
                                setUploading(false);
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <select
                            className="bg-secondary border border-border rounded-sm px-3 py-2 text-sm font-body text-foreground"
                            value={editForm.media_type || "image"}
                            onChange={(e) => setEditForm((p) => ({ ...p, media_type: e.target.value }))}
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="youtube">YouTube</option>
                          </select>
                          <input
                            placeholder="Category"
                            value={editForm.category || ""}
                            onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                            className="bg-secondary border border-border rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary/50"
                          />
                          <input
                            type="number"
                            placeholder="Order"
                            value={editForm.display_order ?? 0}
                            onChange={(e) => setEditForm((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                            className="bg-secondary border border-border rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary/50"
                          />
                          <label className="flex items-center gap-2 text-sm font-body text-foreground">
                            <input
                              type="checkbox"
                              checked={editForm.is_active ?? true}
                              onChange={(e) => setEditForm((p) => ({ ...p, is_active: e.target.checked }))}
                              className="accent-primary"
                            />
                            Active
                          </label>
                        </div>
                        <input
                          placeholder="Link URL (optional)"
                          value={editForm.link_url || ""}
                          onChange={(e) => setEditForm((p) => ({ ...p, link_url: e.target.value }))}
                          className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary/50"
                        />
                        {editForm.media_url && (
                          <div className="mt-2">
                            {(editForm.media_type === 'youtube' || editForm.media_url.includes('youtube.com') || editForm.media_url.includes('youtu.be')) ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={(() => {
                                    const match = editForm.media_url!.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
                                    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : '';
                                  })()}
                                  alt="YouTube Preview"
                                  className="w-32 h-20 object-cover rounded"
                                />
                                <span className="text-xs text-green-400 font-body">✅ YouTube detected</span>
                              </div>
                            ) : (
                              <img src={editForm.media_url} alt="Preview" className="w-32 h-20 object-cover rounded" />
                            )}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 text-xs font-body bg-gradient-gold text-primary-foreground rounded-sm hover:opacity-90">
                            <Save className="w-3.5 h-3.5" /> Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-body text-muted-foreground hover:text-foreground">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          {(() => {
                            const preview = getPreviewImage(item);
                            return preview ? (
                              <img
                                src={preview}
                                alt=""
                                className="w-16 h-10 object-cover rounded flex-shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-16 h-10 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-muted-foreground opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                </svg>
                              </div>
                            );
                          })()}
                          <div className="min-w-0">
                            <p className="text-foreground font-medium text-sm font-body truncate">{item.title || <span className="text-muted-foreground italic">Click ✏️ to edit</span>}</p>
                            <p className="text-muted-foreground text-xs font-body truncate max-w-xs">
                              {item.description || "No description"}
                              {isYouTubeUrl(item.media_url) && <span className="ml-1 text-red-400">▶ YouTube</span>}
                            </p>
                          </div>
                          {item.category && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-body hidden sm:inline">{item.category}</span>}
                          {!item.is_active && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-body">Hidden</span>}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => handleEdit(item)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Inquiries */}
          {currentSectionConfig?.type === "inquiries" && (
            <>
              <h2 className="text-lg font-display text-foreground mb-4">📬 Contact Inquiries</h2>

              {inquiries.length === 0 && (
                <p className="text-muted-foreground text-sm font-body">No inquiries yet.</p>
              )}

              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className={`bg-card border rounded-lg p-4 ${inq.is_contacted ? "border-green-500/20" : "border-border"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-foreground font-body font-medium">{inq.name}</h3>
                          {inq.event_type && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-body">{inq.event_type}</span>
                          )}
                          {inq.is_contacted && (
                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-body flex items-center gap-1">
                              <Check className="w-3 h-3" /> Contacted
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm font-body mb-2">{inq.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                          <span>📧 {inq.email}</span>
                          {inq.phone && <span>📞 {inq.phone}</span>}
                          <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <button
                          onClick={() => handleContactToggle(inq.id, inq.is_contacted)}
                          className={`p-2 transition-colors ${inq.is_contacted ? "text-green-400 hover:text-muted-foreground" : "text-muted-foreground hover:text-green-400"}`}
                          title={inq.is_contacted ? "Unmark" : "Mark as contacted"}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* SEO Settings */}
          {currentSectionConfig?.type === "seo" && (
            <>
              <h2 className="text-lg font-display text-foreground mb-4">🔍 SEO Settings</h2>

              {seoSettings.length === 0 && (
                <p className="text-muted-foreground text-sm font-body">No SEO settings configured. Run the seed script first.</p>
              )}

              <div className="space-y-3">
                {seoSettings.map((seo) => (
                  <div key={seo.id} className="bg-card border border-border rounded-lg p-4">
                    {seoEditPage === seo.page ? (
                      <div className="space-y-3">
                        <p className="text-primary text-xs uppercase tracking-wider font-body">{seo.page} page</p>
                        <input
                          placeholder="Meta Title"
                          value={seoForm.meta_title || ""}
                          onChange={(e) => setSeoForm((p) => ({ ...p, meta_title: e.target.value }))}
                          className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary/50"
                        />
                        <textarea
                          placeholder="Meta Description"
                          rows={2}
                          value={seoForm.meta_description || ""}
                          onChange={(e) => setSeoForm((p) => ({ ...p, meta_description: e.target.value }))}
                          className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary/50 resize-none"
                        />
                        <input
                          placeholder="Keywords (comma-separated)"
                          value={seoForm.meta_keywords || ""}
                          onChange={(e) => setSeoForm((p) => ({ ...p, meta_keywords: e.target.value }))}
                          className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary/50"
                        />
                        <div className="flex gap-2">
                          <button onClick={handleSeoSave} className="flex items-center gap-1 px-3 py-1.5 text-xs font-body bg-gradient-gold text-primary-foreground rounded-sm hover:opacity-90">
                            <Save className="w-3.5 h-3.5" /> Save
                          </button>
                          <button onClick={() => setSeoEditPage(null)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-body text-muted-foreground hover:text-foreground">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-primary text-xs uppercase tracking-wider font-body mb-1">{seo.page}</p>
                          <p className="text-foreground font-body text-sm font-medium">{seo.meta_title || "No title"}</p>
                          <p className="text-muted-foreground font-body text-xs truncate max-w-lg">{seo.meta_description || "No description"}</p>
                        </div>
                        <button onClick={() => handleSeoEdit(seo)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
