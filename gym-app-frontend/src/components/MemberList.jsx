import { useCallback, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import PropTypes from "prop-types";
import { API } from "../api";

const statusColor = { ACTIVE: "#4caf50", EXPIRING_SOON: "#f39c12", EXPIRED: "#e74c3c" };
const statusLabel = { ACTIVE: "Active", EXPIRING_SOON: "Expiring Soon", EXPIRED: "Expired" };

const MemberList = ({ accessToken, onRecordPayment }) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/members`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMembers(r.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [accessToken]);

  useEffect(() => { if (accessToken) fetchMembers(); }, [accessToken, fetchMembers]);

  const filtered = members.filter(m => {
    const matchSearch =
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.uuid?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const initials = (m) => `${(m.firstName || "?")[0]}${(m.lastName || "?")[0]}`.toUpperCase();

  return (
    <Wrapper>
      <Toolbar>
        <SearchBar>
          <i className="fas fa-search" />
          <input
            placeholder="Search name, email or UUID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchBar>
        <FilterGroup>
          {["ALL", "ACTIVE", "EXPIRING_SOON", "EXPIRED"].map(f => (
            <FilterBtn key={f} $active={filter === f} $status={f} onClick={() => setFilter(f)}>
              {f === "ALL" ? "All" : statusLabel[f]}
            </FilterBtn>
          ))}
        </FilterGroup>
      </Toolbar>

      <CountRow>{filtered.length} member{filtered.length !== 1 ? "s" : ""}</CountRow>

      {loading && <Loading><i className="fas fa-spinner fa-spin" /> Loading members...</Loading>}

      {!loading && filtered.length === 0 && (
        <EmptyState>
          <i className="fas fa-users" />
          <p>No members found</p>
        </EmptyState>
      )}

      <MemberGrid>
        {filtered.map((m, i) => (
          <MemberCard key={m.id} style={{ animationDelay: `${i * 0.04}s` }}>
            <CardTop>
              <Avatar>{initials(m)}</Avatar>
              <MemberInfo>
                <MemberName>{m.firstName} {m.lastName}</MemberName>
                <MemberEmail>{m.email}</MemberEmail>
              </MemberInfo>
              <StatusBadge $color={statusColor[m.status]}>
                {statusLabel[m.status]}
              </StatusBadge>
              <MetaGroup>
                <MetaItem>
                  <i className="fas fa-calendar-alt" />
                  {m.status === "EXPIRED"
                    ? <span style={{ color: "#e74c3c" }}>Expired</span>
                    : <span style={{ color: m.daysLeft <= 10 ? "#f39c12" : "#bbb" }}>{m.daysLeft}d left</span>}
                </MetaItem>
                <MetaItem>
                  <i className="fas fa-sign-out-alt" />
                  <span>{m.endDate || "—"}</span>
                </MetaItem>
              </MetaGroup>
              <CardActions>
                <ActionBtn onClick={() => onRecordPayment(m)}>
                  <i className="fas fa-credit-card" /> Payment
                </ActionBtn>
              </CardActions>
            </CardTop>

            <CardBody>
              <InfoRow>
                <InfoLabel>UUID</InfoLabel>
                <InfoVal $uuid>{m.uuid || "—"}</InfoVal>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Joined</InfoLabel>
                <InfoVal>{m.createdDate || "—"}</InfoVal>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Inside</InfoLabel>
                <InsideDot $active={m.inside}>{m.inside ? "● Inside" : "○ Outside"}</InsideDot>
              </InfoRow>
            </CardBody>
          </MemberCard>
        ))}
      </MemberGrid>
    </Wrapper>
  );
};

MemberList.propTypes = {
  accessToken: PropTypes.string.isRequired,
  onRecordPayment: PropTypes.func.isRequired,
};

export default MemberList;

const fadeUp = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

const Wrapper = styled.div`animation: ${fadeUp} 0.3s ease;`;

const Toolbar = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  gap: 12px; margin-bottom: 14px; flex-wrap: wrap;
`;

const SearchBar = styled.div`
  display: flex; align-items: center; gap: 10px;
  background: #111; border: 1px solid #2a2a2a; border-radius: 6px;
  padding: 9px 14px; flex: 1; min-width: 200px;
  i { color: #555; }
  input { background: none; border: none; color: #fff; font-size: 0.9rem; flex: 1; outline: none; }
  input::placeholder { color: #444; }
`;

const FilterGroup = styled.div`display: flex; gap: 6px; flex-wrap: wrap;`;

const FilterBtn = styled.button`
  padding: 7px 14px;
  border-radius: 20px;
  border: 1px solid ${p =>
    p.$active
      ? p.$status === "ACTIVE" ? "#4caf50"
        : p.$status === "EXPIRING_SOON" ? "#f39c12"
          : p.$status === "EXPIRED" ? "#e74c3c"
            : "#ff6b00"
      : "#2a2a2a"};
  background: ${p =>
    p.$active
      ? p.$status === "ACTIVE" ? "rgba(76,175,80,0.15)"
        : p.$status === "EXPIRING_SOON" ? "rgba(243,156,18,0.15)"
          : p.$status === "EXPIRED" ? "rgba(231,76,60,0.15)"
            : "rgba(255,107,0,0.15)"
      : "transparent"};
  color: ${p =>
    p.$active
      ? p.$status === "ACTIVE" ? "#4caf50"
        : p.$status === "EXPIRING_SOON" ? "#f39c12"
          : p.$status === "EXPIRED" ? "#e74c3c"
            : "#ff6b00"
      : "#666"};
  font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
`;

const CountRow = styled.div`color: #555; font-size: 0.82rem; margin-bottom: 16px;`;
const Loading = styled.div`color: #555; padding: 30px; text-align: center; i { margin-right: 8px; }`;
const EmptyState = styled.div`text-align: center; padding: 50px; color: #333; i { font-size: 2.5rem; margin-bottom: 12px; display: block; } p { margin: 0; }`;

const MemberGrid = styled.div`
  display: flex; flex-direction: column; gap: 10px;
`;

const MemberCard = styled.div`
  background: #111; border: 1px solid #1e1e1e; border-radius: 8px; overflow: hidden;
  border-left: 3px solid transparent;
  animation: ${fadeUp} 0.4s ease both; transition: transform 0.15s, box-shadow 0.15s, border-left-color 0.15s;
  &:hover { border-left-color: #ff6b00; box-shadow: 0 4px 20px rgba(255,107,0,0.12); }
`;

const CardTop = styled.div`
  display: flex; align-items: center; gap: 12px; padding: 14px 20px; flex-wrap: nowrap;
  background: #111;
  @media(max-width:600px){padding:12px 14px;flex-wrap:wrap;}
`;

const Avatar = styled.div`
  width: 42px; height: 42px; border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00, #ff8c3a);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.9rem; color: #fff; flex-shrink: 0;
`;

const MemberInfo = styled.div`flex: 1; min-width: 0;`;
const MemberName = styled.div`font-weight: 700; color: #fff; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
const MemberEmail = styled.div`color: #666; font-size: 0.78rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;

const StatusBadge = styled.div`
  padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700;
  background: ${p => p.$color}22; color: ${p => p.$color};
  white-space: nowrap; flex-shrink: 0;
`;

const CardBody = styled.div`
  max-height: 0; overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 20px;
  ${MemberCard}:hover & {
    max-height: 200px;
    padding: 12px 20px;
    border-top: 1px solid #1e1e1e;
  }
`;

const InfoRow = styled.div`display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #181818; font-size: 0.82rem;`;
const InfoLabel = styled.span`color: #555; text-transform: uppercase; letter-spacing: 0.4px; font-size: 0.72rem;`;

const InfoVal = styled.span`
  color: ${p => p.$warn ? "#f39c12" : "#bbb"};
  font-size: ${p => p.$uuid ? "0.68rem" : "0.82rem"};
  font-family: ${p => p.$uuid ? "monospace" : "inherit"};
  max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

const InsideDot = styled.span`
  color: ${p => p.$active ? "#4caf50" : "#555"};
  font-size: 0.82rem; font-weight: 600;
`;

const CardActions = styled.div`
  display: flex; gap: 8px; flex-shrink: 0; margin-left: auto;
  @media(max-width:600px){width:100%;margin-left:54px;}
`;

const MetaGroup = styled.div`
  display: flex; flex-direction: column; gap: 3px; flex-shrink: 0;
  @media(max-width:600px){display:none;}
`;

const MetaItem = styled.div`
  display: flex; align-items: center; gap: 5px;
  font-size: 0.75rem; color: #555;
  i { font-size: 0.65rem; color: #444; }
`;

const ActionBtn = styled.button`
  padding: 6px 14px; background: transparent; border: 1px solid #ff6b00;
  color: #ff8b35; border-radius: 6px; font-size: 0.78rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.2s;
  &:hover { background: rgba(255,107,0,0.14); color:#fff; }
`;
