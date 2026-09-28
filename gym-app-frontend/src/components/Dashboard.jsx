import { useEffect, useState, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import MemberList from "./MemberList";
import PaymentModal from "./PaymentModal";
import ipFavImg from "../assets/IP FAV.png";
import { API } from "../api";

const NAV = [
  { key: "overview", icon: "fa-th-large", label: "Dashboard" },
  { key: "members", icon: "fa-users", label: "Members" },
  { key: "renewals", icon: "fa-sync-alt", label: "Renewal Center" },
  { key: "payments", icon: "fa-receipt", label: "Payments" },
  { key: "leads", icon: "fa-user-clock", label: "Interest Forms" },
  { key: "tools", icon: "fa-tools", label: "Admin Tools" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [userRole, setUserRole] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // admin tools form
  const [formType, setFormType] = useState("form4");
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState(0);
  const [fPrice, setFPrice] = useState({ oneMonths: 0, threeMonths: 0, sixMonths: 0, twelveMonths: 0 });
  const [fMeas, setFMeas] = useState({ email: "", height: 0, weight: 0, chest: 0, waist: 0, hip: 0 });
  const [fUser, setFUser] = useState({ firstName: "", lastName: "", email: "", endDate: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // data
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [occupancy, setOccupancy] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [registrationSort, setRegistrationSort] = useState("newest");
  const [daysLeft, setDaysLeft] = useState(null);
  const [measurements, setMeasurements] = useState([]);

  // payment modal
  const [showPayment, setShowPayment] = useState(false);
  const [payMember, setPayMember] = useState(null);
  const [lastReceipt, setLastReceipt] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = JSON.parse(localStorage.getItem("userRole")) || [];
    if (!token) { navigate("/unauthorized"); return; }
    setAccessToken(token);
    setUserRole(role);
  }, [navigate]);
  const resetMsg = () => { setSuccessMsg(""); setErrorMsg(""); };

  const loadDashboard = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [sRes, aRes, mRes, oRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, headers),
        axios.get(`${API}/activity?limit=10`, headers),
        axios.get(`${API}/members`, headers),
        axios.get(`${API}/dashboard/occupancy?days=7`, headers),
      ]);
      setStats(sRes.data);
      setActivity(aRes.data);
      setOccupancy(oRes.data);
      setLastUpdated(new Date());
      const sorted = [...mRes.data].sort((a, b) =>
        new Date(b.createdDate || 0) - new Date(a.createdDate || 0)).slice(0, 5);
      setRecentMembers(sorted);
    } catch (e) { console.error(e); }
  }, []);

  const loadUserData = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [d, m] = await Promise.all([
        axios.get(`${API}/days`, headers),
        axios.get(`${API}/measurements`, headers),
      ]);
      setDaysLeft(d.data);
      setMeasurements(m.data);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    if (userRole.includes("ROLE_ADMIN")) {
      loadDashboard();
      const id = setInterval(loadDashboard, 30000);
      return () => clearInterval(id);
    }
    if (userRole.includes("ROLE_USER")) {
      loadUserData();
      const id = setInterval(loadUserData, 30000);
      return () => clearInterval(id);
    }
  }, [accessToken, userRole, loadDashboard, loadUserData]);

  const submit = async (endpoint, data, resetFn) => {
    resetMsg(); setLoading(true);
    // Read token directly from localStorage to avoid stale closure
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post(`${API}/${endpoint}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg("Saved successfully!");
      resetFn();
      loadDashboard();
    } catch (err) {
      console.error("Submit error:", err?.response?.status, err?.response?.data);
      setErrorMsg("Something went wrong.");
    }
    finally { setLoading(false); }
  };

  const exportCSV = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const r = await axios.get(`${API}/members/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement("a"); a.href = url; a.download = "ironpeak-members.csv";
      document.body.appendChild(a); a.click(); a.remove();
    } catch { setErrorMsg("Export failed."); }
  };

  const isAdmin = userRole.includes("ROLE_ADMIN");
  const isUser = userRole.includes("ROLE_USER");
  const sortedRecentMembers = [...recentMembers].sort((a, b) => registrationSort === "oldest"
    ? new Date(a.createdDate || 0) - new Date(b.createdDate || 0)
    : new Date(b.createdDate || 0) - new Date(a.createdDate || 0));

  return (
    <Shell>
      {/* ── Sidebar ── */}
      {isAdmin && (
        <Sidebar $open={sidebarOpen}>
          <SidebarTop $open={sidebarOpen}>
            <SidebarLogo>
              <SidebarLogoImg $open={sidebarOpen} src={ipFavImg} alt="IronPeak Gym" />
            </SidebarLogo>
            <CollapseBtn
              type="button"
              aria-label={sidebarOpen ? "Collapse navigation" : "Expand navigation"}
              onClick={() => setSidebarOpen(p => !p)}
            >
              <i className={`fas fa-${sidebarOpen ? "angle-left" : "angle-right"}`} />
            </CollapseBtn>
          </SidebarTop>

          <NavSection>
            {sidebarOpen && <NavLabel>Navigation</NavLabel>}
            <NavList>
              {NAV.map(n => (
                <NavItemBtn
                  key={n.key}
                  $active={activeTab === n.key}
                  aria-current={activeTab === n.key ? "page" : undefined}
                  onClick={() => setActiveTab(n.key)}
                >
                  <div className="icon-wrap"><i className={`fas ${n.icon}`} /></div>
                  {sidebarOpen && <span>{n.label}</span>}
                </NavItemBtn>
              ))}
            </NavList>
          </NavSection>

          <SidebarBottom>
            <NavItemBtn aria-label="Export members as CSV" onClick={exportCSV}>
              <div className="icon-wrap"><i className="fas fa-download" /></div>
              {sidebarOpen && <span>Export CSV</span>}
            </NavItemBtn>
            <NavItemBtn aria-label="Log out" $danger onClick={() => { localStorage.clear(); navigate("/"); }}>
              <div className="icon-wrap"><i className="fas fa-sign-out-alt" /></div>
              {sidebarOpen && <span>Logout</span>}
            </NavItemBtn>
          </SidebarBottom>
        </Sidebar>
      )}

      {/* ── Main Content ── */}
      <Main $sidebar={isAdmin} $open={sidebarOpen}>
        {isAdmin && (
          <TopBar>
            <TopBarTitle>
              {NAV.find(n => n.key === activeTab)?.label || "Dashboard"}
            </TopBarTitle>
            <TopBarRight>
              {stats && (
                <InsidePill>
                  <div className="dot" />
                  {stats.insideNow} inside now
                </InsidePill>
              )}
              {lastUpdated && <RefreshState>Updated {formatTime(lastUpdated.toISOString())}</RefreshState>}
              <AddMemberBtn onClick={() => { setFormType("form4"); setActiveTab("tools"); }}>
                <i className="fas fa-plus" /> Add Member
              </AddMemberBtn>
              <PaymentQuickBtn onClick={() => { setPayMember(null); setShowPayment(true); }}>
                <i className="fas fa-credit-card" /> Record Payment
              </PaymentQuickBtn>
            </TopBarRight>
          </TopBar>
        )}

        <Content>
          {/* ── Overview ── */}
          {isAdmin && activeTab === "overview" && (
            <OverviewGrid>
              {/* Stats */}
              {stats && (
                <StatsRow>
                  {[
                    { label: "Total Members", val: stats.totalMembers, meta: "Current roster", color: "#ff6b00", icon: "fa-id-card" },
                    { label: "Active Members", val: stats.activeMembers, meta: "In good standing", color: "#4caf50", icon: "fa-circle-check" },
                    { label: "Expiring Soon", val: stats.expiringSoon, meta: "Next 10 days", color: "#f39c12", icon: "fa-hourglass-half" },
                    { label: "Revenue This Month", val: `₹${stats.revenueThisMonth || 0}`, meta: stats.revenueTrend || "Recorded payments", color: "#3498db", icon: "fa-receipt" },
                    { label: "Current Occupancy", val: stats.insideNow, meta: "Inside now", color: "#8e6bbd", icon: "fa-person-running" },
                  ].map((s, i) => (
                    <StatCard key={i} color={s.color}>
                      <StatIcon color={s.color}><i className={`fas ${s.icon}`} /></StatIcon>
                      <StatNum>{s.val}</StatNum>
                      <StatLbl>{s.label}</StatLbl>
                      <StatMeta>{s.meta}</StatMeta>
                    </StatCard>
                  ))}
                </StatsRow>
              )}

              <QuickActions aria-label="Dashboard quick actions">
                <QuickActionBtn onClick={() => { setFormType("form1"); setActiveTab("tools"); }}><i className="fas fa-arrows-rotate" /> Renew membership</QuickActionBtn>
                <QuickActionBtn onClick={() => setActiveTab("renewals")}><i className="fas fa-bell" /> Send reminder</QuickActionBtn>
              </QuickActions>

              <OccupancyPanel>
                <PanelHeader>
                  <PanelTitle><i className="fas fa-chart-column" /> Occupancy Activity</PanelTitle>
                  <PanelHint>Last 7 days</PanelHint>
                </PanelHeader>
                {occupancy.length === 0
                  ? <EmptyHint>No entry activity recorded yet.</EmptyHint>
                  : <OccupancyChart>
                    {occupancy.map(point => (
                      <OccupancyBar key={point.label}>
                        <OccupancyValue>{point.visits}</OccupancyValue>
                        <OccupancyBarFill $height={Math.max(12, (point.visits / Math.max(...occupancy.map(item => item.visits))) * 100)} />
                        <OccupancyLabel>{point.label}</OccupancyLabel>
                      </OccupancyBar>
                    ))}
                  </OccupancyChart>}
              </OccupancyPanel>

              <TwoCol>
                {/* Recent Activity */}
                <Panel>
                  <PanelHeader>
                    <PanelTitle><i className="fas fa-bolt" /> Recent Activity</PanelTitle>
                  </PanelHeader>
                  <ActivityList>
                    {activity.length === 0 && <EmptyHint>No activity yet.</EmptyHint>}
                    {activity.map((a, i) => (
                      <ActivityItem key={i}>
                        <ActivityDot type={a.eventType} />
                        <ActivityBody>
                          <ActivityDesc>{a.description}</ActivityDesc>
                          <ActivityTime>{formatTime(a.createdAt)}</ActivityTime>
                        </ActivityBody>
                      </ActivityItem>
                    ))}
                  </ActivityList>
                </Panel>

                {/* Recent Registrations */}
                <Panel>
                  <PanelHeader>
                    <PanelTitle><i className="fas fa-user-plus" /> Recent Registrations</PanelTitle>
                    <PanelTools>
                      <SortSelect aria-label="Sort recent registrations" value={registrationSort} onChange={e => setRegistrationSort(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </SortSelect>
                      <ViewAllBtn onClick={() => setActiveTab("members")}>View All</ViewAllBtn>
                    </PanelTools>
                  </PanelHeader>
                  <RegTable>
                    <thead>
                      <tr><th>Member</th><th>Status</th><th>Expires</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {sortedRecentMembers.map((m, i) => (
                        <tr key={i}>
                          <td>
                            <MiniAvatar>{initials(m)}</MiniAvatar>
                            <span>{m.firstName} {m.lastName}</span>
                          </td>
                          <td><StatusPill status={m.status}>{statusLabel(m.status)}</StatusPill></td>
                          <td>{m.daysLeft > 0 ? <DaysBadge $warn={m.daysLeft <= 10}>{m.daysLeft}d</DaysBadge> : <DaysBadge $expired>Exp</DaysBadge>}</td>
                          <td><MemberActionBtn onClick={() => { setPayMember(m); setShowPayment(true); }} aria-label={`Record payment for ${m.firstName} ${m.lastName}`}><i className="fas fa-ellipsis" /></MemberActionBtn></td>
                        </tr>
                      ))}
                      {recentMembers.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "#777", padding: "20px" }}>No members yet</td></tr>}
                    </tbody>
                  </RegTable>
                </Panel>
              </TwoCol>
            </OverviewGrid>
          )}

          {/* ── Members ── */}
          {isAdmin && activeTab === "members" && (
            <MemberList
              accessToken={accessToken}
              onRecordPayment={(m) => { setPayMember(m); setShowPayment(true); }}
            />
          )}

          {/* ── Renewal Center ── */}
          {isAdmin && activeTab === "renewals" && (
            <RenewalCenter accessToken={accessToken} onRefresh={loadDashboard} />
          )}

          {/* ── Interest Forms ── */}
          {isAdmin && activeTab === "leads" && (
            <LeadsTab accessToken={accessToken} />
          )}

          {/* ── Payments ── */}
          {isAdmin && activeTab === "payments" && (
            <PaymentsTab accessToken={accessToken} />
          )}

          {/* ── Admin Tools ── */}
          {isAdmin && activeTab === "tools" && (
            <ToolsArea>
              <ToolsIntro>
                <div>
                  <ToolsEyebrow><i className="fas fa-sliders-h" /> Operations desk</ToolsEyebrow>
                  <ToolsHeading>Admin tools</ToolsHeading>
                  <ToolsDescription>Manage memberships, pricing, and member records from one place.</ToolsDescription>
                </div>
                <ToolsIntroMark><i className="fas fa-dumbbell" /></ToolsIntroMark>
              </ToolsIntro>
              <ToolsQuickGrid>
                {[
                  { k: "form4", icon: "fa-user-plus", label: "New member", detail: "Create a member profile", tone: "orange" },
                  { k: "form1", icon: "fa-calendar-alt", label: "Extend membership", detail: "Update a member's expiry", tone: "green" },
                  { k: "form2", icon: "fa-tags", label: "Membership prices", detail: "Set current plan prices", tone: "gold" },
                  { k: "form3", icon: "fa-ruler-combined", label: "Measurements", detail: "Log fitness progress", tone: "blue" },
                ].map(tool => (
                  <ToolsQuickCard key={tool.k} $tone={tool.tone} onClick={() => { setFormType(tool.k); resetMsg(); }}>
                    <ToolsQuickIcon $tone={tool.tone}><i className={`fas ${tool.icon}`} /></ToolsQuickIcon>
                    <span><strong>{tool.label}</strong><small>{tool.detail}</small></span>
                    <i className="fas fa-arrow-right" />
                  </ToolsQuickCard>
                ))}
              </ToolsQuickGrid>
              <ToolsNav>
                {[
                  { k: "form1", icon: "fa-calendar-alt", l: "Update Date" },
                  { k: "form2", icon: "fa-tags", l: "Prices" },
                  { k: "form3", icon: "fa-ruler-combined", l: "Measurement" },
                  { k: "form4", icon: "fa-user-plus", l: "New Member" },
                ].map(f => (
                  <ToolBtn key={f.k} $active={formType === f.k} onClick={() => { setFormType(f.k); resetMsg(); }}>
                    <i className={`fas ${f.icon}`} />{f.l}
                  </ToolBtn>
                ))}
              </ToolsNav>

              {formType === "form1" && (
                <FormCard>
                  <FormTitle>Update Membership Date</FormTitle>
                  <form onSubmit={e => { e.preventDefault(); submit("updateDate", { email, month }, () => { setEmail(""); setMonth(0); }); }}>
                    <FG><FL>Member Email</FL><FI type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="member@email.com" required /></FG>
                    <FG><FL>Extend By</FL>
                      <FS value={month} onChange={e => setMonth(parseInt(e.target.value))}>
                        <option value={0}>Select months</option>
                        {[1, 3, 6, 12].map(m => <option key={m} value={m}>{m} Month{m > 1 ? "s" : ""}</option>)}
                      </FS>
                    </FG>
                    <FSub type="submit" disabled={loading}>{loading ? "Saving..." : "Update Date"}</FSub>
                  </form>
                  {successMsg && <OK>{successMsg}</OK>}
                  {errorMsg && <ER>{errorMsg}</ER>}
                </FormCard>
              )}

              {formType === "form2" && (
                <FormCard>
                  <FormTitle>Update Membership Prices (₹)</FormTitle>
                  <form onSubmit={e => { e.preventDefault(); submit("priceUpdate", fPrice, () => setFPrice({ oneMonths: 0, threeMonths: 0, sixMonths: 0, twelveMonths: 0 })); }}>
                    <FGrid>
                      {[["1 Month", "oneMonths"], ["3 Months", "threeMonths"], ["6 Months", "sixMonths"], ["12 Months", "twelveMonths"]].map(([l, k]) => (
                        <FG key={k}><FL>{l}</FL><FI type="number" value={fPrice[k]} onChange={e => setFPrice({ ...fPrice, [k]: parseInt(e.target.value) })} required /></FG>
                      ))}
                    </FGrid>
                    <FSub type="submit" disabled={loading}>{loading ? "Saving..." : "Update Prices"}</FSub>
                  </form>
                  {successMsg && <OK>{successMsg}</OK>}
                  {errorMsg && <ER>{errorMsg}</ER>}
                </FormCard>
              )}

              {formType === "form3" && (
                <FormCard>
                  <FormTitle>Log Body Measurement</FormTitle>
                  <form onSubmit={e => { e.preventDefault(); submit("measurementCreate", fMeas, () => setFMeas({ email: "", height: 0, weight: 0, chest: 0, waist: 0, hip: 0 })); }}>
                    <FGrid>
                      <FG><FL>Member Email</FL><FI type="email" value={fMeas.email} onChange={e => setFMeas({ ...fMeas, email: e.target.value })} required /></FG>
                      {[["Height (cm)", "height"], ["Weight (kg)", "weight"], ["Chest (cm)", "chest"], ["Waist (cm)", "waist"], ["Hip (cm)", "hip"]].map(([l, k]) => (
                        <FG key={k}><FL>{l}</FL><FI type="number" value={fMeas[k]} onChange={e => setFMeas({ ...fMeas, [k]: parseInt(e.target.value) })} required /></FG>
                      ))}
                    </FGrid>
                    <FSub type="submit" disabled={loading}>{loading ? "Saving..." : "Save Measurement"}</FSub>
                  </form>
                  {successMsg && <OK>{successMsg}</OK>}
                  {errorMsg && <ER>{errorMsg}</ER>}
                </FormCard>
              )}

              {formType === "form4" && (
                <FormCard>
                  <FormTitle>Create New Member</FormTitle>
                  <form onSubmit={e => { e.preventDefault(); submit("saveUser", fUser, () => setFUser({ firstName: "", lastName: "", email: "", endDate: "" })); }}>
                    <FGrid>
                      <FG><FL>First Name</FL><FI type="text" value={fUser.firstName} onChange={e => setFUser({ ...fUser, firstName: e.target.value })} required /></FG>
                      <FG><FL>Last Name</FL><FI type="text" value={fUser.lastName} onChange={e => setFUser({ ...fUser, lastName: e.target.value })} required /></FG>
                      <FG><FL>Email</FL><FI type="email" value={fUser.email} onChange={e => setFUser({ ...fUser, email: e.target.value })} required /></FG>
                      <FG><FL>Membership End Date</FL><FI type="date" value={fUser.endDate} onChange={e => setFUser({ ...fUser, endDate: e.target.value })} required /></FG>
                    </FGrid>
                    <FSub type="submit" disabled={loading}>{loading ? "Creating..." : "Create Member"}</FSub>
                  </form>
                  {successMsg && <OK>{successMsg}</OK>}
                  {errorMsg && <ER>{errorMsg}</ER>}
                </FormCard>
              )}
            </ToolsArea>
          )}

          {/* ── User Dashboard ── */}
          {isUser && (
            <UserDash>
              <UserPageTitle>My Dashboard</UserPageTitle>
              <UserCards>
                <UserStatCard $warn={daysLeft !== null && daysLeft <= 10}>
                  <UserStatNum>{daysLeft !== null ? daysLeft : "—"}</UserStatNum>
                  <UserStatLbl>Days Remaining</UserStatLbl>
                  {daysLeft !== null && daysLeft <= 10 && daysLeft > 0 && <WarnTag>⚠ Renew Soon</WarnTag>}
                  {daysLeft === 0 && <WarnTag $expired>Expired</WarnTag>}
                </UserStatCard>
              </UserCards>

              <SectionHead>Body Measurements</SectionHead>
              {measurements.length === 0
                ? <EmptyHint><i className="fas fa-ruler-combined" /> No measurements logged yet.</EmptyHint>
                : (
                  <MeasGrid>
                    {measurements.map((m, i) => (
                      <MeasCard key={i}>
                        <MeasDate>{m.createdDate || "—"}</MeasDate>
                        {[["Height", m.height, "cm"], ["Weight", m.weight, "kg"], ["Chest", m.chest, "cm"], ["Waist", m.waist, "cm"], ["Hip", m.hip, "cm"]].map(([l, v, u]) => (
                          <MRow key={l}><span>{l}</span><strong>{v} {u}</strong></MRow>
                        ))}
                      </MeasCard>
                    ))}
                  </MeasGrid>
                )}
            </UserDash>
          )}
        </Content>
      </Main>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          member={payMember}
          accessToken={accessToken}
          onClose={() => setShowPayment(false)}
          onSuccess={(r) => { setLastReceipt(r); setShowPayment(false); loadDashboard(); }}
        />
      )}

      {lastReceipt && (
        <Toast>
          <i className="fas fa-check-circle" /> Payment recorded — Receipt <strong>{lastReceipt.receiptNumber}</strong>
          <ToastClose onClick={() => setLastReceipt(null)}>×</ToastClose>
        </Toast>
      )}
    </Shell>
  );
};

// ── Payments Tab ──────────────────────────────────────────────────────────────
const PaymentsTab = ({ accessToken }) => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${API}/payments`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => setPayments(r.data)).catch(console.error);
  }, [accessToken]);

  const filtered = payments.filter(p =>
    `${p.memberName} ${p.memberEmail} ${p.receiptNumber}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SearchBar>
        <i className="fas fa-search" />
        <input placeholder="Search receipt, name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </SearchBar>
      <PTable>
        <thead><tr><th>Receipt</th><th>Member</th><th>Plan</th><th>Amount</th><th>Mode</th><th>Date</th></tr></thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id}>
              <td><code>{p.receiptNumber}</code></td>
              <td><div style={{ fontWeight: 600 }}>{p.memberName}</div><small>{p.memberEmail}</small></td>
              <td>{p.plan}</td>
              <td style={{ color: "#4caf50", fontWeight: 700 }}>₹{p.amount}</td>
              <td><ModeBadge mode={p.paymentMode}>{p.paymentMode}</ModeBadge></td>
              <td>{p.paymentDate}</td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#333", padding: "30px" }}>No payments found</td></tr>}
        </tbody>
      </PTable>
    </div>
  );
};

// ── Leads / Interest Forms Tab ───────────────────────────────────────────────
const LeadsTab = ({ accessToken }) => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [leadFilter, setLeadFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [followUpData, setFollowUpData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ironpeakLeadFollowUps") || "{}");
    } catch {
      return {};
    }
  });
  const [leadNote, setLeadNote] = useState("");
  const [leadFollowUpDate, setLeadFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const [enrollingLeadId, setEnrollingLeadId] = useState(null);
  const [leadActionStatus, setLeadActionStatus] = useState("");

  useEffect(() => {
    axios.get(`${API}/interest`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then(r => setLeads(r.data)).catch(console.error);
  }, [accessToken]);

  const filtered = leads.filter(l =>
    `${l.fullName} ${l.email} ${l.phone} ${l.fitnessGoal}`
      .toLowerCase().includes(search.toLowerCase())
  );
  const pendingLeads = filtered.filter(l => (l.status || "PENDING") !== "APPROVED");
  const approvedLeads = filtered.filter(l => (l.status || "PENDING") === "APPROVED");
  const allPendingLeads = leads.filter(l => (l.status || "PENDING") !== "APPROVED");
  const allApprovedLeads = leads.filter(l => (l.status || "PENDING") === "APPROVED");
  const visibleLeads = leadFilter === "pending"
    ? pendingLeads
    : leadFilter === "approved"
      ? approvedLeads
      : filtered;
  const leadStats = {
    total: leads.length,
    pending: allPendingLeads.length,
    approved: allApprovedLeads.length,
  };

  const formattedLeadStatus = lead => (lead.status === "APPROVED" ? "Approved" : "Pending");
  const phoneDigits = val => (val || "").replace(/\D/g, "");
  const whatsappHref = val => {
    const digits = phoneDigits(val);
    return digits ? `https://wa.me/${digits}` : "#";
  };

  const updateFollowUp = (leadId, changes) => {
    setFollowUpData(current => {
      const next = {
        ...current,
        [leadId]: { stage: "new", notes: [], ...current[leadId], ...changes },
      };
      localStorage.setItem("ironpeakLeadFollowUps", JSON.stringify(next));
      return next;
    });
  };

  const addLeadNote = () => {
    const text = leadNote.trim();
    if (!selectedLead || !text) return;
    const current = followUpData[selectedLead.id] || { stage: "new", notes: [] };
    updateFollowUp(selectedLead.id, {
      notes: [{ text, createdAt: new Date().toISOString() }, ...(current.notes || [])],
    });
    setLeadNote("");
  };

  const enrollLead = async () => {
    if (!selectedLead || !selectedLead.email) {
      setLeadActionStatus("Lead is missing an email address.");
      return;
    }

    const fullName = (selectedLead.fullName || "").trim();
    const parts = fullName ? fullName.split(/\s+/) : ["New", "Member"];
    const firstName = parts[0] || "New";
    const lastName = parts.slice(1).join(" ") || "Member";

    setEnrollingLeadId(selectedLead.id);
    setLeadActionStatus("");

    try {
      await axios.post(`${API}/saveUser`, {
        firstName,
        lastName,
        email: selectedLead.email,
        endDate: leadFollowUpDate,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await axios.patch(`${API}/interest/${selectedLead.id}/approve`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      updateFollowUp(selectedLead.id, { stage: "converted" });
      setLeadActionStatus(`Converted ${firstName} ${lastName} into a member with expiry ${leadFollowUpDate}.`);
      setSelectedLead(null);
      setEnrollingLeadId(null);
      const fresh = await axios.get(`${API}/interest`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setLeads(fresh.data);
    } catch (error) {
      console.error(error);
      setLeadActionStatus("Could not convert this lead into a member. Try again.");
      setEnrollingLeadId(null);
    }
  };

  return (
    <LeadShell>
      <LeadsHeader>
        <div>
          <LeadHeaderBadge><i className="fas fa-sparkles" /> Sales pipeline</LeadHeaderBadge>
          <LeadsTitle><i className="fas fa-user-clock" /> Interest Form Submissions</LeadsTitle>
          <LeadsSubtitle>{leadStats.total} total submission{leadStats.total !== 1 ? "s" : ""}</LeadsSubtitle>
        </div>
        <LeadHeaderAction>
          <i className="fas fa-bolt" /> Live follow-up
        </LeadHeaderAction>
      </LeadsHeader>

      <LeadStatsRow>
        <LeadStatCard>
          <LeadStatIcon><i className="fas fa-layer-group" /></LeadStatIcon>
          <LeadStatLabel>Total</LeadStatLabel>
          <LeadStatValue><AnimatedCount value={leadStats.total} /></LeadStatValue>
        </LeadStatCard>
        <LeadStatCard $warning>
          <LeadStatIcon><i className="fas fa-hourglass-half" /></LeadStatIcon>
          <LeadStatLabel>Pending</LeadStatLabel>
          <LeadStatValue><AnimatedCount value={leadStats.pending} /></LeadStatValue>
        </LeadStatCard>
        <LeadStatCard $success>
          <LeadStatIcon><i className="fas fa-check-circle" /></LeadStatIcon>
          <LeadStatLabel>Approved</LeadStatLabel>
          <LeadStatValue><AnimatedCount value={leadStats.approved} /></LeadStatValue>
        </LeadStatCard>
      </LeadStatsRow>

      <LeadFilterBar>
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
        ].map(filter => (
          <LeadFilterButton
            key={filter.key}
            $active={leadFilter === filter.key}
            onClick={() => setLeadFilter(filter.key)}
          >
            {filter.label}
          </LeadFilterButton>
        ))}
      </LeadFilterBar>

      <SearchBar>
        <i className="fas fa-search" />
        <input placeholder="Search by name, email, goal..." value={search} onChange={e => setSearch(e.target.value)} />
      </SearchBar>
      {visibleLeads.length === 0 ? (
        <EmptyHint><i className="fas fa-inbox" /> No interest form submissions yet.</EmptyHint>
      ) : (
        <LeadTimeline>
          {visibleLeads.map(l => {
            const approved = (l.status || "PENDING") === "APPROVED";
            const leadProgress = followUpData[l.id] || { stage: approved ? "converted" : "new", notes: [] };
            const safePhone = phoneDigits(l.phone);

            return (
              <LeadTimelineItem key={l.id} $approved={approved}>
                <LeadTimelineMarker $approved={approved}>
                  <i className={`fas ${approved ? "fa-check" : leadProgress.stage === "new" ? "fa-clock" : "fa-bolt"}`} />
                </LeadTimelineMarker>
                <LeadTimelineCard>
                  <LeadTimelineHead>
                    <LeadInfo>
                      <LeadName>{l.fullName}</LeadName>
                      <LeadEmail>{l.email}</LeadEmail>
                    </LeadInfo>
                    <LeadStatusBadge $approved={approved}>{formattedLeadStatus(l)}</LeadStatusBadge>
                  </LeadTimelineHead>

                  <LeadTimelineMeta>
                    <MetaPill><i className="fas fa-dumbbell" /> {l.fitnessGoal || "General goal"}</MetaPill>
                    <MetaPill><i className="fas fa-calendar-alt" /> {l.submittedAt ? new Date(l.submittedAt).toLocaleDateString("en-IN") : "—"}</MetaPill>
                  </LeadTimelineMeta>

                  <LeadRow><span>Phone</span><strong>{l.phone || "—"}</strong></LeadRow>
                  <LeadRow><span>Age</span><strong>{l.age || "—"}</strong></LeadRow>
                  <LeadRow><span>Gender</span><strong>{l.gender || "—"}</strong></LeadRow>
                  <LeadStageStrip>
                    {["new", "contacted", "trial", "converted"].map((stage, stageIndex) => {
                      const currentStage = ["new", "contacted", "trial", "converted"].indexOf(leadProgress.stage);
                      return (
                        <LeadStageStep key={stage} $active={stageIndex <= currentStage} $approved={approved}>
                          <i className={`fas ${stageIndex < currentStage ? "fa-check" : "fa-circle"}`} />
                          <span>{stage === "trial" ? "Trial booked" : stage[0].toUpperCase() + stage.slice(1)}</span>
                        </LeadStageStep>
                      );
                    })}
                  </LeadStageStrip>
                  {approved && (
                    <LeadRow><span>Added to gym</span><strong>{l.approvedAt ? new Date(l.approvedAt).toLocaleDateString("en-IN") : "—"}</strong></LeadRow>
                  )}

                  {l.message && <LeadMessage>&quot;{l.message}&quot;</LeadMessage>}
                  {(leadProgress.notes || []).length > 0 && (
                    <LeadNotesPreview>
                      <i className="fas fa-quote-left" />
                      <span>{leadProgress.notes[0].text}</span>
                      <small>{formatTime(leadProgress.notes[0].createdAt)}</small>
                    </LeadNotesPreview>
                  )}

                  <LeadQuickActions>
                    <LeadActionMini as="a" href={`mailto:${l.email}?subject=${encodeURIComponent("Gym follow-up")}`}>
                      <i className="fas fa-envelope" /> Email
                    </LeadActionMini>
                    <LeadActionMini as="a" href={safePhone ? `tel:${l.phone}` : "#"} $disabled={!safePhone}>
                      <i className="fas fa-phone" /> Call
                    </LeadActionMini>
                    <LeadActionMini as="a" href={safePhone ? whatsappHref(l.phone) : "#"} target={safePhone ? "_blank" : undefined} rel={safePhone ? "noreferrer" : undefined} $disabled={!safePhone}>
                      <i className="fab fa-whatsapp" /> WhatsApp
                    </LeadActionMini>
                    <LeadViewButton onClick={() => setSelectedLead(l)}>
                      <i className="fas fa-eye" /> View
                    </LeadViewButton>
                  </LeadQuickActions>
                </LeadTimelineCard>
              </LeadTimelineItem>
            );
          })}
        </LeadTimeline>
      )}

      {selectedLead && (
        <LeadModalBackdrop onClick={() => setSelectedLead(null)}>
          <LeadModal onClick={e => e.stopPropagation()}>
            <LeadModalHeader>
              <div>
                <LeadModalTitle>{selectedLead.fullName}</LeadModalTitle>
                <LeadModalMeta>{selectedLead.email}</LeadModalMeta>
              </div>
              <LeadCloseButton onClick={() => setSelectedLead(null)} aria-label="Close lead details">
                <i className="fas fa-times" />
              </LeadCloseButton>
            </LeadModalHeader>

            <LeadModalGrid>
              <LeadModalItem><span>Phone</span><strong>{selectedLead.phone || "—"}</strong></LeadModalItem>
              <LeadModalItem><span>Age</span><strong>{selectedLead.age || "—"}</strong></LeadModalItem>
              <LeadModalItem><span>Gender</span><strong>{selectedLead.gender || "—"}</strong></LeadModalItem>
              <LeadModalItem><span>Goal</span><strong>{selectedLead.fitnessGoal || "—"}</strong></LeadModalItem>
              <LeadModalItem><span>Submitted</span><strong>{selectedLead.submittedAt ? new Date(selectedLead.submittedAt).toLocaleString("en-IN") : "—"}</strong></LeadModalItem>
            </LeadModalGrid>

            <LeadModalSection>
              <h4>Message</h4>
              <p>{selectedLead.message || "No message was provided."}</p>
            </LeadModalSection>

            <LeadFollowUpPanel>
              <LeadFollowUpTitle><i className="fas fa-route" /> Follow-up stage</LeadFollowUpTitle>
              <LeadStageSelect
                value={followUpData[selectedLead.id]?.stage || (selectedLead.status === "APPROVED" ? "converted" : "new")}
                onChange={e => updateFollowUp(selectedLead.id, { stage: e.target.value })}
                aria-label="Lead follow-up stage"
              >
                <option value="new">New lead</option>
                <option value="contacted">Contacted</option>
                <option value="trial">Trial booked</option>
                <option value="converted">Converted</option>
              </LeadStageSelect>
              <LeadNotesList>
                {(followUpData[selectedLead.id]?.notes || []).map((note, index) => (
                  <LeadNoteItem key={`${note.createdAt}-${index}`}>
                    <span>{note.text}</span><small>{new Date(note.createdAt).toLocaleString("en-IN")}</small>
                  </LeadNoteItem>
                ))}
                {(followUpData[selectedLead.id]?.notes || []).length === 0 && <LeadNoNotes>No follow-up notes yet.</LeadNoNotes>}
              </LeadNotesList>
              <LeadNoteComposer>
                <textarea value={leadNote} onChange={e => setLeadNote(e.target.value)} placeholder="Add a call summary or next step..." rows={2} />
                <LeadNoteButton onClick={addLeadNote} disabled={!leadNote.trim()}><i className="fas fa-plus" /> Add note</LeadNoteButton>
              </LeadNoteComposer>
            </LeadFollowUpPanel>

            <LeadModalFooter>
              <LeadFollowUpGroup>
                <label htmlFor="lead-follow-up-date">Membership expiry</label>
                <input
                  id="lead-follow-up-date"
                  type="date"
                  value={leadFollowUpDate}
                  onChange={e => setLeadFollowUpDate(e.target.value)}
                />
              </LeadFollowUpGroup>

              <LeadActionRow>
                <LeadSecondaryAction as="a" href={`mailto:${selectedLead.email}`}>
                  <i className="fas fa-envelope" /> Email
                </LeadSecondaryAction>
                <LeadPrimaryAction onClick={enrollLead} disabled={enrollingLeadId === selectedLead.id}>
                  {enrollingLeadId === selectedLead.id ? <><i className="fas fa-spinner fa-spin" /> Converting...</> : <><i className="fas fa-user-plus" /> Add to Gym</>}
                </LeadPrimaryAction>
              </LeadActionRow>
            </LeadModalFooter>

            {leadActionStatus && <LeadActionStatus>{leadActionStatus}</LeadActionStatus>}
          </LeadModal>
        </LeadModalBackdrop>
      )}
    </LeadShell>
  );
};

// ── Renewal Center ────────────────────────────────────────────────────────────
const RenewalCenter = ({ accessToken, onRefresh }) => {
  const [members, setMembers] = useState([]);
  const [sending, setSending] = useState({});
  const [sent, setSent] = useState({});

  useEffect(() => {
    axios.get(`${API}/renewals`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => setMembers(r.data)).catch(console.error);
  }, [accessToken]);

  const sendReminder = async (email, id) => {
    setSending(p => ({ ...p, [id]: true }));
    try {
      await axios.post(`${API}/renewals/remind`, { email }, { headers: { Authorization: `Bearer ${accessToken}` } });
      setSent(p => ({ ...p, [id]: true }));
      onRefresh();
    } catch (e) { console.error(e); }
    finally { setSending(p => ({ ...p, [id]: false })); }
  };

  return (
    <div>
      <RenewalHeader>
        <RenewalTitle>
          <i className="fas fa-sync-alt" /> Members expiring in next 7 days
        </RenewalTitle>
        <RenewalCount>{members.length} member{members.length !== 1 ? "s" : ""}</RenewalCount>
      </RenewalHeader>

      {members.length === 0 ? (
        <GreenBox><i className="fas fa-check-circle" /> No expiries in the next 7 days. All good!</GreenBox>
      ) : (
        <RenewalList>
          {members.map(m => (
            <RenewalCard key={m.id}>
              <RenewalAvatar>{initials(m)}</RenewalAvatar>
              <RenewalInfo>
                <RenewalName>{m.firstName} {m.lastName}</RenewalName>
                <RenewalEmail>{m.email}</RenewalEmail>
                <RenewalExpiry>Expires: {m.endDate} · <DaysBadge $warn>{m.daysLeft} days left</DaysBadge></RenewalExpiry>
              </RenewalInfo>
              <ReminderBtn
                onClick={() => sendReminder(m.email, m.id)}
                disabled={sending[m.id] || sent[m.id]}
                $sent={sent[m.id]}
              >
                {sent[m.id]
                  ? <><i className="fas fa-check" /> Sent</>
                  : sending[m.id]
                    ? <><i className="fas fa-spinner fa-spin" /> Sending...</>
                    : <><i className="fas fa-bell" /> Send Reminder</>}
              </ReminderBtn>
            </RenewalCard>
          ))}
        </RenewalList>
      )}
    </div>
  );
};

PaymentsTab.propTypes = {
  accessToken: PropTypes.string.isRequired,
};

LeadsTab.propTypes = {
  accessToken: PropTypes.string.isRequired,
};

RenewalCenter.propTypes = {
  accessToken: PropTypes.string.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = m => `${(m.firstName || "?")[0]}${(m.lastName || "?")[0]}`.toUpperCase();
const statusLabel = s => s === "ACTIVE" ? "Active" : s === "EXPIRING_SOON" ? "Expiring Soon" : "Expired";
const statusColor = { ACTIVE: "#4caf50", EXPIRING_SOON: "#f39c12", EXPIRED: "#e74c3c" };
const activityColor = { PAYMENT: "#4caf50", MEMBER_CREATED: "#3498db", RENEWAL: "#f39c12", REMINDER: "#9b59b6", MEASUREMENT: "#1abc9c" };

const formatTime = (dt) => {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString("en-IN");
  } catch { return ""; }
};

const AnimatedCount = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const startedAt = performance.now();
    let frameId;
    const animate = now => {
      const progress = Math.min((now - startedAt) / 650, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(target * eased));
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return count;
};

AnimatedCount.propTypes = { value: PropTypes.number.isRequired };

export default Dashboard;

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
const pulseCss = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.03)}`;
const leadGlow = keyframes`0%,100%{opacity:.16;filter:blur(18px)}50%{opacity:.48;filter:blur(26px)}`;
const leadSweep = keyframes`0%{transform:translateX(-130%) skewX(-18deg);opacity:0}18%{opacity:.2}55%,100%{transform:translateX(260%) skewX(-18deg);opacity:0}`;

// ── Styled ────────────────────────────────────────────────────────────────────
const Shell = styled.div`
  display:flex;min-height:100vh;background:#080808;padding-top:64px;
  width:100%;overflow-x:hidden;
`;

const SIDEBAR_W = "240px";
const SIDEBAR_C = "60px";

const Sidebar = styled.aside`
  width: ${p => p.$open ? SIDEBAR_W : SIDEBAR_C};
  background: #0c0c0c;
  border-right: 1px solid #161616;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 64px; left: 0; bottom: 0;
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
`;

const SidebarTop = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  padding:${p => p.$open ? "12px 14px" : "10px 8px"};border-bottom:1px solid #1a1a1a;
  min-height:${p => p.$open ? "82px" : "62px"};transition:padding .25s ease,min-height .25s ease;
`;

const SidebarLogo = styled.div`display:flex;align-items:center;gap:10px;overflow:hidden;min-width:0;`;

const SidebarLogoImg = styled.img`
  height:${p => p.$open ? "58px" : "42px"};width:${p => p.$open ? "58px" : "42px"};
  object-fit:contain;flex-shrink:0;border-radius:6px;transition:height .25s ease,width .25s ease;
`;

const CollapseBtn = styled.button`
  background:none;border:none;color:#444;cursor:pointer;
  padding:4px;font-size:0.75rem;flex-shrink:0;
  &:hover{color:#ff6b00;}
`;

const NavSection = styled.div`flex:1;padding:8px;overflow-y:auto;overflow-x:hidden;&::-webkit-scrollbar{width:3px;}&::-webkit-scrollbar-thumb{background:#1e1e1e;border-radius:3px;}`;
const NavLabel = styled.div`color:#2a2a2a;font-size:0.6rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:12px 10px 4px;white-space:nowrap;`;
const NavList = styled.nav`display:flex;flex-direction:column;gap:2px;`;

const NavItemBtn = styled.button`
  display:flex;align-items:center;gap:12px;
  padding:10px 10px;border-radius:6px;border:none;
  background:${p => p.$active ? "rgba(255,107,0,0.12)" : "transparent"};
  color:${p => p.$active ? "#ff6b00" : p.$danger ? "#e74c3c" : "#666"};
  border-left:${p => p.$active ? "2px solid #ff6b00" : "2px solid transparent"};
  font-size:0.85rem;font-weight:600;cursor:pointer;white-space:nowrap;
  transition:all 0.15s;text-align:left;width:100%;
  i{font-size:0.9rem;flex-shrink:0;width:18px;text-align:center;}
  &:hover{background:${p => p.$danger ? "rgba(231,76,60,0.1)" : "rgba(255,107,0,0.08)"};color:${p => p.$danger ? "#e74c3c" : "#ff6b00"};}
  .icon-wrap {
    width:30px;height:30px;border-radius:6px;
    background:rgba(255,255,255,0.04);
    display:flex;align-items:center;justify-content:center;
    flex-shrink:0;transition:background 0.15s;
    i{font-size:0.8rem;}
  }
`;

const SidebarBottom = styled.div`padding:10px 8px;border-top:1px solid #1a1a1a;display:flex;flex-direction:column;gap:4px;`;

const Main = styled.main`
  flex:1;
  margin-left:${p => p.$sidebar ? (p.$open ? SIDEBAR_W : SIDEBAR_C) : "0"};
  transition:margin-left 0.25s ease;
  min-height:100vh;
  display:flex;flex-direction:column;
  @media(max-width:700px){margin-left:${p => p.$sidebar ? SIDEBAR_C : "0"};}
`;

const TopBar = styled.div`
  min-height:64px;height:auto;background:#0d0d0d;border-bottom:1px solid #1a1a1a;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 28px;position:sticky;top:64px;z-index:50;
  @media(max-width:700px){padding:10px 14px;gap:10px;align-items:flex-start;}
`;

const TopBarTitle = styled.h2`
  font-family:'Rajdhani',sans-serif;font-size:1.3rem;letter-spacing:2px;
  color:#ff6b00;margin:0;text-transform:uppercase;
`;

const TopBarRight = styled.div`
  display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap;
  @media(max-width:700px){gap:6px;}
`;

const RefreshState = styled.span`color:#8a8a8a;font-size:0.72rem;white-space:nowrap;`;

const InsidePill = styled.div`
  display:flex;align-items:center;gap:6px;
  background:#111;border:1px solid #1e1e1e;
  border-radius:20px;padding:5px 12px;
  color:#888;font-size:0.78rem;
`;

const AddMemberBtn = styled.button`
  padding:7px 14px;background:#ff6b00;border:none;color:#fff;
  border-radius:6px;font-size:0.8rem;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:6px;
  &:hover{background:#e05e00;}
  @media(max-width:700px){padding:6px 8px;font-size:0.7rem;}
`;

const PaymentQuickBtn = styled.button`
  padding:7px 14px;background:transparent;border:1px solid #ff6b00;
  color:#ff6b00;border-radius:6px;font-size:0.8rem;font-weight:700;
  cursor:pointer;display:flex;align-items:center;gap:6px;
  &:hover{background:rgba(255,107,0,0.1);}
  @media(max-width:700px){padding:6px 8px;font-size:0.7rem;}
`;

const Content = styled.div`
  padding:24px 32px;animation:${fadeUp} 0.3s ease;max-width:none;
  @media(max-width:700px){padding:18px 14px;}
`;

const QuickActions = styled.div`
  display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;
  padding:2px 0 0;
`;

const QuickActionBtn = styled.button`
  display:flex;align-items:center;gap:7px;padding:8px 12px;
  background:linear-gradient(135deg,#171717,#111);border:1px solid #303030;color:#c5c5c5;
  border-radius:6px;font-size:0.74rem;text-transform:none;letter-spacing:0;
  transition:transform .2s ease,border-color .2s ease,color .2s ease,box-shadow .2s ease;
  &:hover{transform:translateY(-2px);border-color:#ff6b00;color:#fff;background:#1a1a1a;box-shadow:0 7px 18px rgba(0,0,0,.24);}
  i{color:#ff6b00;}
`;

// Overview
const OverviewGrid = styled.div`display:flex;flex-direction:column;gap:20px;`;

const StatsRow = styled.div`
  display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:20px;
  @media(max-width:1100px){grid-template-columns:repeat(3,1fr);}
  @media(max-width:640px){grid-template-columns:repeat(2,1fr);}
`;

const StatCard = styled.div`
  background:linear-gradient(135deg,#111 0%,#0f0f0f 100%);
  border:1px solid #1e1e1e;border-top:3px solid ${p => p.color};
  border-radius:8px;padding:20px 16px;text-align:center;
  transition:transform 0.2s,box-shadow 0.2s,border-top-color 0.2s;
  &:hover{
    transform:translateY(-4px);
    box-shadow:0 12px 32px ${p => p.color}44;
    border-top-color:${p => p.color};
  }
`;

const StatIcon = styled.div`
  display:flex;align-items:center;justify-content:center;
  min-height:22px;margin-bottom:8px;
  color:${p => p.color};font-size:1.2rem;line-height:1;opacity:0.85;
  i{display:block;font-family:"Font Awesome 6 Free";font-weight:900;line-height:1;}
`;
const StatNum = styled.div`font-family:'Rajdhani',sans-serif;font-size:2.2rem;font-weight:700;color:#fff;line-height:1;`;
const StatLbl = styled.div`color:#666;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;margin-top:4px;`;
const StatMeta = styled.div`color:#8a8a8a;font-size:0.68rem;margin-top:6px;`;

const TwoCol = styled.div`display:grid;grid-template-columns:1fr 1.2fr;gap:20px;@media(max-width:900px){grid-template-columns:1fr;}`;

const Panel = styled.div`background:linear-gradient(135deg,#111 0%,#0f0f0f 100%);border:1px solid #1e1e1e;border-radius:8px;overflow:hidden;`;

const OccupancyPanel = styled(Panel)`overflow:hidden;`;

const PanelHint = styled.span`color:#8a8a8a;font-size:0.72rem;`;

const OccupancyChart = styled.div`
  min-height:150px;padding:18px 24px 14px;display:flex;align-items:flex-end;gap:14px;
`;

const OccupancyBar = styled.div`
  flex:1;min-width:28px;height:112px;display:flex;flex-direction:column;
  align-items:center;justify-content:flex-end;gap:5px;
`;

const OccupancyValue = styled.span`color:#c5c5c5;font-size:0.72rem;`;

const OccupancyBarFill = styled.div`
  width:100%;height:${p => p.$height}%;min-height:12px;
  background:linear-gradient(180deg,#3498db,#24658c);border-radius:4px 4px 2px 2px;
  transition:height 0.3s ease;
`;

const OccupancyLabel = styled.span`color:#8a8a8a;font-size:0.68rem;text-transform:uppercase;`;

const PanelHeader = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:14px 18px;border-bottom:1px solid #1a1a1a;background:#141414;
`;

const PanelTools = styled.div`display:flex;align-items:center;gap:8px;`;

const SortSelect = styled.select`
  background:#111;border:1px solid #2a2a2a;color:#aaa;border-radius:4px;
  padding:4px 6px;font:inherit;font-size:0.72rem;
`;

const PanelTitle = styled.h3`
  margin:0;font-family:'Rajdhani',sans-serif;font-size:0.95rem;
  color:#fff;letter-spacing:1px;display:flex;align-items:center;gap:8px;
  i{color:#ff6b00;}
`;

const ViewAllBtn = styled.button`
  background:none;border:1px solid #2a2a2a;color:#666;
  padding:4px 12px;border-radius:4px;font-size:0.75rem;cursor:pointer;
  &:hover{border-color:#ff6b00;color:#ff6b00;}
`;

const MemberActionBtn = styled.button`
  width:28px;height:28px;padding:0;background:transparent;border:1px solid #2a2a2a;
  color:#888;border-radius:4px;font-size:0.75rem;text-transform:none;letter-spacing:0;
  &:hover{border-color:#ff6b00;color:#ff6b00;}
`;

// Activity
const ActivityList = styled.div`padding:8px 0;max-height:380px;overflow-y:auto;`;

const ActivityItem = styled.div`
  display:flex;align-items:flex-start;gap:12px;padding:10px 18px;
  border-bottom:1px solid #141414;
  &:last-child{border:none;}
`;

const ActivityDot = styled.div`
  width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;
  background:${p => activityColor[p.type] || "#555"};
`;

const ActivityBody = styled.div`flex:1;`;
const ActivityDesc = styled.div`color:#ccc;font-size:0.82rem;line-height:1.4;`;
const ActivityTime = styled.div`color:#444;font-size:0.72rem;margin-top:3px;`;

// Recent registrations table
const RegTable = styled.table`
  width:100%;border-collapse:collapse;
  th{padding:10px 14px;background:#141414;color:#555;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;text-align:left;}
  td{padding:10px 14px;border-bottom:1px solid #141414;color:#ccc;font-size:0.82rem;vertical-align:middle;}
  tr:last-child td{border:none;}
  tr:hover td{background:#131313;}
  td:first-child{display:flex;align-items:center;gap:8px;}
`;

const MiniAvatar = styled.div`
  width:28px;height:28px;border-radius:50%;
  background:linear-gradient(135deg,#ff6b00,#ff8c3a);
  display:flex;align-items:center;justify-content:center;
  font-size:0.65rem;font-weight:700;color:#fff;flex-shrink:0;
`;

const StatusPill = styled.span`
  padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700;
  background:${p => statusColor[p.status]}22;color:${p => statusColor[p.status]};
`;

const DaysBadge = styled.span`
  padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700;
  background:${p => p.$expired ? "rgba(231,76,60,0.15)" : p.$warn ? "rgba(243,156,18,0.15)" : "rgba(76,175,80,0.15)"};
  color:${p => p.$expired ? "#e74c3c" : p.$warn ? "#f39c12" : "#4caf50"};
`;

// Renewal Center
const RenewalHeader = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;`;
const RenewalTitle = styled.h3`font-family:'Rajdhani',sans-serif;color:#fff;font-size:1.2rem;margin:0;i{color:#f39c12;margin-right:8px;}`;
const RenewalCount = styled.span`color:#555;font-size:0.85rem;`;

const GreenBox = styled.div`
  background:rgba(76,175,80,0.08);border:1px solid rgba(76,175,80,0.3);
  color:#4caf50;padding:24px;border-radius:8px;text-align:center;font-size:1rem;
  i{margin-right:8px;}
`;

const RenewalList = styled.div`display:flex;flex-direction:column;gap:10px;`;

const RenewalCard = styled.div`
  display:flex;align-items:center;gap:14px;
  background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;
  transition:box-shadow 0.2s;
  &:hover{box-shadow:0 4px 16px rgba(243,156,18,0.1);}
`;

const RenewalAvatar = styled.div`
  width:42px;height:42px;border-radius:50%;
  background:linear-gradient(135deg,#f39c12,#e67e22);
  display:flex;align-items:center;justify-content:center;
  font-weight:700;color:#fff;font-size:0.9rem;flex-shrink:0;
`;

const RenewalInfo = styled.div`flex:1;`;
const RenewalName = styled.div`font-weight:700;color:#fff;font-size:0.92rem;`;
const RenewalEmail = styled.div`color:#555;font-size:0.78rem;`;
const RenewalExpiry = styled.div`color:#777;font-size:0.78rem;margin-top:4px;display:flex;align-items:center;gap:6px;`;

const ReminderBtn = styled.button`
  padding:8px 16px;
  background:${p => p.$sent ? "rgba(76,175,80,0.1)" : "rgba(243,156,18,0.1)"};
  border:1px solid ${p => p.$sent ? "#4caf50" : "#f39c12"};
  color:${p => p.$sent ? "#4caf50" : "#f39c12"};
  border-radius:6px;font-size:0.78rem;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:6px;white-space:nowrap;
  transition:all 0.2s;
  &:disabled{opacity:0.7;cursor:not-allowed;}
  &:hover:not(:disabled){background:${p => p.$sent ? "rgba(76,175,80,0.2)" : "rgba(243,156,18,0.2)"};}
`;

// Admin Tools
const ToolsArea = styled.div`display:flex;flex-direction:column;gap:20px;animation:${fadeUp} .35s ease both;`;

const ToolsIntro = styled.div`
  position:relative;display:flex;align-items:center;justify-content:space-between;gap:18px;overflow:hidden;
  min-height:150px;padding:26px 30px;border:1px solid #28231e;border-radius:14px;
  background:radial-gradient(ellipse at 85% 25%,rgba(255,107,0,.14),transparent 38%),linear-gradient(115deg,#151311,#0e0e0e 70%);
  &::after{content:"";position:absolute;inset:-70% auto -70% -20%;width:35%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);transform:rotate(18deg);animation:${leadSweep} 7s ease-in-out infinite;pointer-events:none;}
`;
const ToolsEyebrow = styled.div`color:#ff9b52;font-size:.68rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;i{margin-right:8px;}`;
const ToolsHeading = styled.h2`margin:8px 0 5px;color:#fff;font-family:'Rajdhani',sans-serif;font-size:1.8rem;line-height:1;text-transform:uppercase;`;
const ToolsDescription = styled.p`margin:0;color:#929292;font-size:.84rem;`;
const ToolsIntroMark = styled.div`width:74px;height:74px;display:grid;place-items:center;border:1px solid rgba(255,107,0,.3);border-radius:50%;color:#ff7a1a;font-size:1.7rem;box-shadow:0 0 35px rgba(255,107,0,.16),inset 0 0 22px rgba(255,107,0,.08);`;
const ToolsQuickGrid = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;@media(max-width:1000px){grid-template-columns:repeat(2,minmax(0,1fr));}@media(max-width:560px){grid-template-columns:1fr;}`;
const toolTone = { orange: "#ff7a1a", green: "#42c978", gold: "#e9b64b", blue: "#53a9df" };
const ToolsQuickCard = styled.button`
  display:flex;align-items:center;gap:12px;min-width:0;padding:15px 14px;text-align:left;
  background:linear-gradient(135deg,#151515,#101010);border:1px solid #272727;border-radius:10px;color:#fff;cursor:pointer;
  transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease;
  >span{display:flex;flex:1;flex-direction:column;gap:3px;min-width:0;}
  strong{font-size:.82rem;}small{color:#737373;font-size:.7rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  >i{color:#555;font-size:.72rem;transition:transform .22s ease,color .22s ease;}
  &:hover{transform:translateY(-3px);border-color:${p => toolTone[p.$tone]};box-shadow:0 12px 28px ${p => `${toolTone[p.$tone]}22`};}
  &:hover >i{transform:translateX(3px);color:${p => toolTone[p.$tone]};}
`;
const ToolsQuickIcon = styled.div`
  width:38px;height:38px;display:grid;place-items:center;flex-shrink:0;border:1px solid ${p => `${toolTone[p.$tone]}44`};border-radius:9px;
  color:${p => toolTone[p.$tone]};background:${p => `${toolTone[p.$tone]}12`};
`;

const ToolsNav = styled.div`display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px;`;

const ToolBtn = styled.button`
  padding:9px 18px;
  background:${p => p.$active ? "#ff6b00" : "#111"};
  border:1px solid ${p => p.$active ? "#ff6b00" : "#2a2a2a"};
  color:${p => p.$active ? "#fff" : "#888"};
  border-radius:6px;font-size:0.82rem;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:8px;transition:all 0.15s;
  &:hover{border-color:#ff6b00;color:#fff;}
`;

const FormCard = styled.div`background:linear-gradient(135deg,#111 0%,#0f0f0f 100%);border:1px solid #1e1e1e;border-radius:8px;padding:28px;animation:${fadeUp} 0.25s ease;max-width:800px;`;
const FormTitle = styled.h3`font-family:'Rajdhani',sans-serif;color:#fff;font-size:1.2rem;margin:0 0 20px;letter-spacing:1px;`;
const FGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;margin-bottom:18px;`;
const FG = styled.div``;
const FL = styled.label`display:block;color:#777;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px;`;
const FI = styled.input`width:100%;padding:9px 12px;border:1px solid #2a2a2a;border-radius:5px;background:#0a0a0a;color:#fff;font-size:0.88rem;box-sizing:border-box;transition:border-color 0.2s;&:focus{outline:none;border-color:#ff6b00;}&::placeholder{color:#333;}`;
const FS = styled.select`width:100%;padding:9px 12px;border:1px solid #2a2a2a;border-radius:5px;background:#0a0a0a;color:#fff;font-size:0.88rem;box-sizing:border-box;&:focus{outline:none;border-color:#ff6b00;}option{background:#0a0a0a;}`;
const FSub = styled.button`padding:10px 24px;background:#ff6b00;border:none;color:#fff;border-radius:6px;font-weight:700;font-size:0.88rem;cursor:pointer;transition:background 0.2s;&:hover:not(:disabled){background:#e05e00;}&:disabled{opacity:0.6;cursor:not-allowed;}`;
const OK = styled.p`color:#4caf50;font-size:0.82rem;font-weight:600;margin-top:10px;`;
const ER = styled.p`color:#e74c3c;font-size:0.82rem;font-weight:600;margin-top:10px;`;

// Search
const SearchBar = styled.div`display:flex;align-items:center;gap:10px;background:#111;border:1px solid #2a2a2a;border-radius:6px;padding:9px 14px;margin-bottom:16px;i{color:#555;}input{background:none;border:none;color:#fff;font-size:0.88rem;flex:1;outline:none;}input::placeholder{color:#333;}`;

// Payment table
const PTable = styled.table`
  width:100%;border-collapse:collapse;background:#111;border-radius:8px;overflow:hidden;
  th{background:#141414;color:#777;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;padding:11px 15px;text-align:left;}
  td{padding:11px 15px;border-bottom:1px solid #141414;color:#bbb;font-size:0.82rem;}
  td small{color:#444;font-size:0.72rem;}
  tr:hover td{background:#131313;}
  code{color:#ff6b00;font-size:0.72rem;}
`;

const ModeBadge = styled.span`
  padding:2px 9px;border-radius:20px;font-size:0.7rem;font-weight:700;
  background:${p => p.mode === "UPI" ? "rgba(155,89,182,0.15)" : p.mode === "Cash" ? "rgba(76,175,80,0.15)" : "rgba(52,152,219,0.15)"};
  color:${p => p.mode === "UPI" ? "#9b59b6" : p.mode === "Cash" ? "#4caf50" : "#3498db"};
`;

// User dashboard
const UserDash = styled.div`animation:${fadeUp} 0.3s ease;`;
const UserPageTitle = styled.h1`font-family:'Rajdhani',sans-serif;font-size:2rem;color:#ff6b00;letter-spacing:2px;margin-bottom:24px;`;
const UserCards = styled.div`display:flex;gap:16px;flex-wrap:wrap;margin-bottom:28px;`;

const UserStatCard = styled.div`
  background:#111;border:1px solid #1e1e1e;
  border-left:4px solid ${p => p.$warn ? "#e74c3c" : "#4caf50"};
  border-radius:8px;padding:24px 32px;min-width:180px;
  animation:${p => p.$warn ? css`${pulseCss} 2s infinite` : "none"};
`;
const UserStatNum = styled.div`font-family:'Rajdhani',sans-serif;font-size:3.5rem;font-weight:700;color:#fff;line-height:1;`;
const UserStatLbl = styled.div`color:#666;font-size:0.78rem;text-transform:uppercase;letter-spacing:1px;margin-top:5px;`;
const WarnTag = styled.div`margin-top:8px;display:inline-block;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;background:${p => p.$expired ? "rgba(231,76,60,0.15)" : "rgba(243,156,18,0.15)"};color:${p => p.$expired ? "#e74c3c" : "#f39c12"};`;
const SectionHead = styled.h3`font-family:'Rajdhani',sans-serif;color:#fff;font-size:1.2rem;letter-spacing:1px;border-bottom:1px solid #1e1e1e;padding-bottom:10px;margin-bottom:16px;`;
const EmptyHint = styled.div`color:#333;padding:20px 0;font-size:0.88rem;i{margin-right:8px;}`;

const MeasGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;`;
const MeasCard = styled.div`background:#111;border:1px solid #1e1e1e;border-radius:6px;padding:15px;`;
const MeasDate = styled.div`color:#ff6b00;font-size:0.72rem;font-weight:700;text-transform:uppercase;margin-bottom:10px;`;
const MRow = styled.div`display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #161616;font-size:0.82rem;span{color:#555;}strong{color:#bbb;}`;

// Toast
const Toast = styled.div`position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a2e1a;border:1px solid #4caf50;color:#4caf50;padding:12px 22px;border-radius:8px;font-size:0.85rem;display:flex;align-items:center;gap:10px;z-index:4000;animation:${fadeUp} 0.3s ease;i{font-size:1rem;}`;
const ToastClose = styled.button`background:none;border:none;color:#4caf50;font-size:1.1rem;cursor:pointer;padding:0 0 0 8px;`;

// ── Lead / Interest Form Styled Components ────────────────────────────────────
const LeadShell = styled.div`
  position:relative;isolation:isolate;margin-top:10px;overflow:visible;
  background:radial-gradient(ellipse at 4% 0%, rgba(255,107,0,0.12), transparent 26%),radial-gradient(ellipse at 94% 4%, rgba(155,89,182,0.12), transparent 24%),linear-gradient(180deg,#0d0d0d,#0b0b0b);
  border:1px solid #27221e;border-radius:14px;padding:24px;box-shadow:0 22px 50px rgba(0,0,0,0.22),0 0 40px rgba(255,107,0,.035);
  @media(max-width:700px){padding:16px;}
`;
const LeadsHeader = styled.div`position:relative;z-index:1;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:20px;padding-top:4px;@media(max-width:640px){align-items:flex-start;flex-direction:column;}`;
const LeadHeaderBadge = styled.div`display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.1em;color:#d8b9ff;background:rgba(155,89,182,0.12);border:1px solid rgba(155,89,182,0.28);margin-bottom:10px;i{color:#d8b9ff;}`;
const LeadsTitle = styled.h3`font-family:'Rajdhani',sans-serif;color:#fff;font-size:1.3rem;margin:0 0 6px;i{color:#9b59b6;margin-right:8px;}`;
const LeadsSubtitle = styled.div`color:#666;font-size:0.82rem;`;
const LeadHeaderAction = styled.div`display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg, rgba(255,107,0,0.15), rgba(155,89,182,0.15));border:1px solid rgba(255,107,0,0.35);color:#ffd9b5;padding:8px 12px;border-radius:10px;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;`;

const LeadStatsRow = styled.div`display:grid;grid-template-columns:repeat(3,minmax(120px,1fr));gap:12px;margin-bottom:18px;`;
const LeadStatCard = styled.div`
  position:relative;overflow:hidden;background:linear-gradient(135deg,#171717,#0f0f0f);border:1px solid ${p => p.$warning ? "rgba(245,158,11,0.38)" : p.$success ? "rgba(34,197,94,0.38)" : "rgba(255,107,0,0.38)"};
  border-radius:12px;padding:16px 18px;box-shadow:0 20px 30px rgba(0,0,0,0.12);transition:transform .24s ease,box-shadow .24s ease;
  &::after{content:"";position:absolute;inset:auto -30px -30px auto;width:80px;height:80px;border-radius:50%;background:${p => p.$warning ? "rgba(245,158,11,0.08)" : p.$success ? "rgba(34,197,94,0.08)" : "rgba(255,107,0,0.1)"};filter:blur(3px);}
  &:hover{transform:translateY(-3px);box-shadow:0 0 28px ${p => p.$warning ? "rgba(245,158,11,.15)" : p.$success ? "rgba(34,197,94,.14)" : "rgba(255,107,0,.16)"};}
`;
const LeadStatIcon = styled.div`width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;color:#fff;border:1px solid rgba(255,255,255,0.08);margin-bottom:10px;`;
const LeadStatLabel = styled.div`color:#7a7a7a;font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;`;
const LeadStatValue = styled.div`margin-top:8px;color:#fff;font-size:1.8rem;font-weight:800;line-height:1;`;

const LeadsGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;
`;

const LeadCard = styled.div`
  background:linear-gradient(180deg,#121212 0%,#0d0d0d 100%);border:1px solid #1f1f1f;border-radius:14px;overflow:hidden;position:relative;
  transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s;
  animation:${fadeUp} 0.35s ease both;
  &::before{content:"";position:absolute;inset:0 0 auto 0;height:2px;background:linear-gradient(90deg,#ff6b00,#9b59b6,#22c55e);opacity:0.9;}
  &:hover{transform:translateY(-4px);box-shadow:0 18px 32px rgba(155,89,182,0.18);border-color:#393939;}
`;

const LeadTop = styled.div`
  display:flex;align-items:center;gap:12px;padding:16px 16px 14px;
  background:linear-gradient(135deg,#171717,#111);border-bottom:1px solid #1b1b1b;
`;

const LeadAvatar = styled.div`
  width:42px;height:42px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,#9b59b6,#8e44ad,#ff6b00);box-shadow:0 10px 18px rgba(155,89,182,0.25);
  display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:0.92rem;color:#fff;
`;

const LeadInfo = styled.div`flex:1;min-width:0;`;
const LeadName = styled.div`font-weight:700;color:#fff;font-size:0.94rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
const LeadEmail = styled.div`color:#666;font-size:0.75rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;

const LeadGoal = styled.div`
  padding:5px 10px;border-radius:20px;font-size:0.7rem;font-weight:700;
  background:rgba(155,89,182,0.12);color:#d5b8f7;white-space:nowrap;flex-shrink:0;border:1px solid rgba(155,89,182,0.25);
`;

const LeadBody = styled.div`padding:14px 16px 16px;`;
const LeadRow = styled.div`display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #181818;font-size:0.82rem;span{color:#666;}strong{color:#dcdcdc;}`;
const LeadMessage = styled.div`margin-top:12px;color:#a4a4a4;font-size:0.78rem;font-style:italic;line-height:1.6;padding:10px 12px;background:rgba(255,255,255,0.02);border:1px solid #1d1d1d;border-radius:8px;`;
const LeadActions = styled.div`margin-top:16px;display:flex;justify-content:flex-end;`;
const LeadStatusBadge = styled.span`
  display:inline-flex;align-items:center;padding:5px 10px;border-radius:999px;font-size:0.68rem;font-weight:700;letter-spacing:0.04em;
  background:${p => p.$approved ? "rgba(34,197,94,0.14)" : "rgba(245,158,11,0.14)"};
  color:${p => p.$approved ? "#86efac" : "#fcd34d"};
  border:1px solid ${p => p.$approved ? "rgba(34,197,94,0.35)" : "rgba(245,158,11,0.35)"};
`;
const LeadViewButton = styled.button`
  border:none;border-radius:10px;padding:10px 12px;background:linear-gradient(135deg,#ff6b00,#9b59b6);color:#fff;font-weight:800;cursor:pointer;
  transition:transform 0.2s, box-shadow 0.2s;display:inline-flex;align-items:center;gap:8px;box-shadow:0 12px 22px rgba(155,89,182,0.22);
  &:hover{transform:translateY(-2px);box-shadow:0 16px 26px rgba(255,107,0,0.22);} 
`;
const ApprovedSection = styled.div`margin-top:28px;padding-top:18px;border-top:1px solid #1b1b1b;`;
const ApprovedTitle = styled.h4`margin:0 0 14px;color:#b7f7c7;font-size:0.9rem;letter-spacing:0.08em;text-transform:uppercase;i{margin-right:8px;}`;
const LeadModalBackdrop = styled.div`
  position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:flex-start;justify-content:center;z-index:3000;overflow-y:auto;padding:72px 24px 24px;
`;
const LeadModal = styled.div`
  width:min(560px, 100%);max-height:calc(100vh - 96px);max-height:calc(100dvh - 96px);background:#111;border:1px solid #1d1d1d;border-radius:12px;box-shadow:0 18px 40px rgba(0,0,0,0.35);overflow-y:auto;overscroll-behavior:contain;
`;
const LeadModalHeader = styled.div`
  display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #1d1d1d;background:#141414;
`;
const LeadModalTitle = styled.h4`margin:0;color:#fff;font-size:1.1rem;`;
const LeadModalMeta = styled.div`color:#8b8b8b;font-size:0.75rem;margin-top:4px;`;
const LeadCloseButton = styled.button`
  width:36px;height:36px;border:none;border-radius:50%;background:#1a1a1a;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;
  &:hover{background:#2a2a2a;}
`;
const LeadModalGrid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:18px 20px;border-bottom:1px solid #1d1d1d;@media(max-width:600px){grid-template-columns:minmax(0,1fr);}`;
const LeadModalItem = styled.div`display:flex;flex-direction:column;gap:6px;padding:10px 12px;background:#171717;border:1px solid #212121;border-radius:8px;span{font-size:0.72rem;color:#666;text-transform:uppercase;letter-spacing:0.06em;}strong{font-size:0.86rem;color:#d9d9d9;}`;
const LeadModalSection = styled.div`padding:18px 20px;h4{margin:0 0 10px;color:#fff;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.08em;}p{margin:0;color:#c4c4c4;line-height:1.7;white-space:pre-wrap;}`;
const LeadModalFooter = styled.div`padding:18px 20px 20px;border-top:1px solid #1d1d1d;background:#141414;`;
const LeadFollowUpGroup = styled.div`display:flex;flex-direction:column;gap:8px;margin-bottom:16px;label{font-size:0.72rem;color:#9a9a9a;text-transform:uppercase;letter-spacing:0.08em;}input{width:100%;background:#111;border:1px solid #2a2a2a;border-radius:8px;padding:10px 12px;color:#fff;}`;
const LeadActionRow = styled.div`display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;`;
const LeadPrimaryAction = styled.button`
  border:none;border-radius:8px;padding:10px 14px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;
  &:disabled{opacity:0.7;cursor:not-allowed;}
`;
const LeadSecondaryAction = styled.a`
  border:1px solid #2a2a2a;border-radius:8px;padding:10px 14px;background:#111;color:#fff;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:8px;
`;
const LeadActionStatus = styled.div`padding:0 20px 20px;color:#a7f3d0;font-size:0.82rem;`;
const LeadFilterBar = styled.div`display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 18px;`;
const LeadFilterButton = styled.button`
  border:1px solid ${p => p.$active ? "rgba(255,107,0,0.5)" : "#292929"};
  background:${p => p.$active ? "linear-gradient(135deg, rgba(255,107,0,0.18), rgba(155,89,182,0.12))" : "#111"};
  color:${p => p.$active ? "#fff" : "#8b8b8b"};
  border-radius:999px;padding:8px 14px;font-size:0.76rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;cursor:pointer;transition:all 0.2s ease;
  &:hover{transform:translateY(-1px);border-color:rgba(255,107,0,0.4);color:#fff;}
`;

const LeadTimeline = styled.div`
  position:relative;display:flex;flex-direction:column;gap:18px;
  &::before{content:"";position:absolute;left:15px;top:8px;bottom:8px;width:2px;background:linear-gradient(180deg, rgba(255,107,0,0.7), rgba(155,89,182,0.5), rgba(34,197,94,0.7));border-radius:999px;}
`;
const LeadTimelineItem = styled.div`
  position:relative;display:flex;gap:18px;align-items:flex-start;padding-left:8px;
`;
const LeadTimelineMarker = styled.div`
  position:relative;z-index:1;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  background:${p => p.$approved ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#ff6b00,#9b59b6)"};border:3px solid #090909;
  box-shadow:0 0 0 6px rgba(255,255,255,0.02),0 0 18px ${p => p.$approved ? "rgba(34,197,94,.26)" : "rgba(255,107,0,.3)"};color:#fff;font-size:0.78rem;flex-shrink:0;
`;
const LeadTimelineCard = styled.div`
  position:relative;isolation:isolate;overflow:hidden;flex:1;min-width:0;background:linear-gradient(135deg,#121212,#0d0d0d);border:1px solid #212121;border-radius:12px;padding:16px 18px;box-shadow:0 16px 30px rgba(0,0,0,0.18);transition:transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
  &::before{content:"";position:absolute;z-index:-1;inset:-35% -10%;background:radial-gradient(ellipse,rgba(255,107,0,.14),transparent 60%);opacity:.12;filter:blur(18px);transition:opacity .3s ease,filter .3s ease;}
  &::after{content:"";position:absolute;inset:0 auto 0 -40%;width:25%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.055),transparent);transform:skewX(-18deg);opacity:0;pointer-events:none;}
  &:hover{transform:translateY(-3px);border-color:rgba(255,107,0,.38);box-shadow:0 24px 42px rgba(0,0,0,0.28),0 0 28px rgba(255,107,0,.09);}
  &:hover::before{opacity:.7;filter:blur(25px);animation:${leadGlow} 2.4s ease-in-out infinite;}
  &:hover::after{opacity:1;animation:${leadSweep} 1.1s ease-out;}
`;
const LeadTimelineHead = styled.div`display:flex;align-items:flex-start;justify-content:space-between;gap:12px;`;
const LeadTimelineMeta = styled.div`display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 10px;`;
const MetaPill = styled.span`display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#b7b7b7;font-size:0.7rem;`;
const LeadQuickActions = styled.div`display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:14px;`;
const LeadActionMini = styled.a`
  display:inline-flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border:1px solid ${p => p.$disabled ? "#232323" : "rgba(255,107,0,0.28)"};
  background:${p => p.$disabled ? "rgba(255,255,255,0.02)" : "rgba(255,107,0,0.08)"};
  color:${p => p.$disabled ? "#555" : "#ffd7b4"};
  font-size:0.72rem;font-weight:700;text-decoration:none;cursor:${p => p.$disabled ? "default" : "pointer"};pointer-events:${p => p.$disabled ? "none" : "auto"};
  &:hover{border-color:${p => p.$disabled ? "#232323" : "rgba(255,107,0,0.45)"};}
`;
const LeadStageStrip = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:16px 0 10px;padding:12px 10px;border:1px solid #202020;border-radius:9px;background:rgba(255,255,255,.015);@media(max-width:520px){grid-template-columns:repeat(2,minmax(0,1fr));}`;
const LeadStageStep = styled.div`
  display:flex;align-items:center;gap:6px;min-width:0;color:${p => p.$active ? (p.$approved ? "#75e59e" : "#ffae70") : "#555"};font-size:.66rem;font-weight:700;
  i{font-size:.58rem;}span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
`;
const LeadNotesPreview = styled.div`display:flex;align-items:flex-start;gap:8px;margin-top:10px;padding:10px 11px;border-left:2px solid #ff7a1a;background:rgba(255,122,26,.045);color:#aaa;font-size:.74rem;line-height:1.45;i{color:#ff9b52;font-size:.65rem;margin-top:3px;}span{flex:1;}small{color:#666;white-space:nowrap;}`;
const LeadFollowUpPanel = styled.div`padding:18px 20px;border-top:1px solid #1d1d1d;background:linear-gradient(135deg,rgba(255,107,0,.035),transparent);`;
const LeadFollowUpTitle = styled.h4`margin:0 0 10px;color:#f1f1f1;font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;i{color:#ff8a38;margin-right:8px;}`;
const LeadStageSelect = styled.select`width:100%;padding:10px 12px;background:#101010;border:1px solid #303030;border-radius:7px;color:#fff;font-size:.82rem;option{background:#101010;}`;
const LeadNotesList = styled.div`display:flex;flex-direction:column;gap:8px;margin:12px 0;max-height:180px;overflow:auto;`;
const LeadNoteItem = styled.div`display:flex;flex-direction:column;gap:4px;padding:9px 11px;background:#151515;border:1px solid #222;border-radius:7px;color:#ccc;font-size:.78rem;line-height:1.45;small{color:#666;font-size:.66rem;}`;
const LeadNoNotes = styled.div`padding:8px 0;color:#696969;font-size:.75rem;`;
const LeadNoteComposer = styled.div`display:flex;align-items:stretch;gap:8px;textarea{flex:1;min-width:0;resize:vertical;background:#101010;border:1px solid #2a2a2a;border-radius:7px;padding:9px 10px;color:#eee;font:inherit;font-size:.78rem;&:focus{outline:none;border-color:#ff7a1a;}}@media(max-width:480px){flex-direction:column;}`;
const LeadNoteButton = styled.button`display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 12px;border:1px solid rgba(255,107,0,.38);border-radius:7px;background:rgba(255,107,0,.1);color:#ffc18f;font-size:.74rem;font-weight:700;cursor:pointer;white-space:nowrap;&:disabled{opacity:.45;cursor:not-allowed;}`;
