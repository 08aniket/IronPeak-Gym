import { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import jsPDF from "jspdf";
import PropTypes from "prop-types";
import { API } from "../api";

const PLANS = ["1 Month", "3 Months", "6 Months", "12 Months"];
const MODES = ["Cash", "UPI", "Card", "Bank Transfer"];

const PaymentModal = ({ member, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    memberEmail: member?.email || "",
    plan: "1 Month",
    amount: "",
    paymentMode: "Cash",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Always read fresh token from localStorage
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.post(`${API}/payments`,
        { ...form, amount: parseInt(form.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess(res.data);
      generatePDF(res.data);
    } catch (err) {
      console.error("Payment error:", err?.response?.status, err?.response?.data);
      setError("Failed to record payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (receipt) => {
    const doc = new jsPDF({ unit: "mm", format: "a5" }); // A5 = 148x210mm, much better than tiny thermal
    const W = 148, H = 210;

    // ── Background ──────────────────────────────────────────────
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, "F");

    // ── Orange header band ───────────────────────────────────────
    doc.setFillColor(255, 107, 0);
    doc.rect(0, 0, W, 38, "F");

    // ── Gym name ─────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("IRONPEAK GYM", W / 2, 16, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Salt Lake City, Sector V, Kolkata — 700091", W / 2, 24, { align: "center" });
    doc.text("contact@ironpeakgym.in  |  +91 98765 43210", W / 2, 30, { align: "center" });

    // ── Diagonal watermark ────────────────────────────────────────
    doc.setTextColor(245, 245, 245);
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.text("PAID", W / 2, H / 2 + 10, { align: "center", angle: 35 });

    // ── Receipt title & badge ─────────────────────────────────────
    doc.setFillColor(232, 245, 233);
    doc.roundedRect(W / 2 - 28, 44, 56, 12, 3, 3, "F");
    doc.setTextColor(46, 125, 50);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("✓  PAYMENT COMPLETE", W / 2, 52, { align: "center" });

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt No: ${receipt.receiptNumber}`, W / 2, 62, { align: "center" });

    // ── Divider ──────────────────────────────────────────────────
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(14, 67, W - 14, 67);

    // ── Fields ───────────────────────────────────────────────────
    const fields = [
      ["GYM", receipt.gymName || "IronPeak Gym"],
      ["MEMBER", receipt.memberName],
      ["EMAIL", receipt.memberEmail],
      ["PLAN", receipt.plan],
      ["AMOUNT", `₹ ${receipt.amount}`],
      ["PAYMENT MODE", receipt.paymentMode],
      ["DATE", receipt.paymentDate],
      ["REMARKS", receipt.remarks || "—"],
      ["BALANCE DUE", "₹ 0"],
    ];

    let y = 76;
    fields.forEach(([label, value], i) => {
      // Alternate row background
      if (i % 2 === 0) {
        doc.setFillColor(249, 249, 249);
        doc.rect(14, y - 5, W - 28, 10, "F");
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text(label, 18, y);

      // Highlight amount in orange
      if (label === "AMOUNT") {
        doc.setTextColor(255, 107, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(40, 40, 40);
      }
      doc.text(String(value || "—"), W - 18, y, { align: "right" });

      y += 11;
    });

    // ── Bottom divider ────────────────────────────────────────────
    doc.setDrawColor(230, 230, 230);
    doc.line(14, y + 2, W - 14, y + 2);

    // ── QR-like decorative box (visual only) ─────────────────────
    doc.setFillColor(255, 107, 0);
    doc.rect(14, y + 8, 18, 18, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(16, y + 10, 14, 14, "F");
    doc.setFillColor(255, 107, 0);
    doc.rect(17, y + 11, 5, 5, "F");
    doc.rect(24, y + 11, 5, 5, "F");
    doc.rect(17, y + 18, 5, 5, "F");
    doc.rect(21, y + 15, 3, 3, "F");

    // ── Footer text ───────────────────────────────────────────────
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(160, 160, 160);
    doc.text("Thank you for choosing IronPeak Gym!", W / 2, y + 14, { align: "center" });
    doc.text("This is a computer-generated receipt.", W / 2, y + 20, { align: "center" });

    // ── Orange bottom strip ───────────────────────────────────────
    doc.setFillColor(255, 107, 0);
    doc.rect(0, H - 10, W, 10, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("IronPeak Gym — Aniket Shaw — Kolkata", W / 2, H - 4, { align: "center" });

    doc.save(`receipt-${receipt.receiptNumber}.pdf`);
  };

  return (
    <Overlay onClick={onClose}>
      <Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle id="payment-modal-title">
            <i className="fas fa-credit-card" />
            Record Payment
          </ModalTitle>
          <CloseBtn type="button" aria-label="Close payment dialog" onClick={onClose}>×</CloseBtn>
        </ModalHeader>

        {member && (
          <MemberBanner>
            <Avatar>{`${(member.firstName || "?")[0]}${(member.lastName || "?")[0]}`.toUpperCase()}</Avatar>
            <div>
              <MemberName>{member.firstName} {member.lastName}</MemberName>
              <MemberEmail>{member.email}</MemberEmail>
            </div>
          </MemberBanner>
        )}

        <form onSubmit={handleSubmit}>
          {!member && (
            <FGroup>
              <FLabel>Member Email</FLabel>
              <FInput type="email" value={form.memberEmail} onChange={e => setForm({ ...form, memberEmail: e.target.value })} placeholder="member@email.com" required />
            </FGroup>
          )}

          <FRow>
            <FGroup>
              <FLabel>Plan</FLabel>
              <FSelect value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}>
                {PLANS.map(p => <option key={p}>{p}</option>)}
              </FSelect>
            </FGroup>
            <FGroup>
              <FLabel>Amount (₹)</FLabel>
              <FInput type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 1200" required min="1" />
            </FGroup>
          </FRow>

          <FGroup>
            <FLabel>Payment Mode</FLabel>
            <ModeGrid>
              {MODES.map(m => (
                <ModeBtn key={m} $active={form.paymentMode === m} type="button" onClick={() => setForm({ ...form, paymentMode: m })}>
                  <i className={`fas fa-${m === "Cash" ? "money-bill-wave" : m === "UPI" ? "mobile-alt" : m === "Card" ? "credit-card" : "university"}`} />
                  {m}
                </ModeBtn>
              ))}
            </ModeGrid>
          </FGroup>

          <FGroup>
            <FLabel>Remarks (optional)</FLabel>
            <FInput type="text" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="e.g. Monthly renewal" />
          </FGroup>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitRow>
            <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
            <SubmitBtn type="submit" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin" /> Processing...</> : <><i className="fas fa-check" /> Confirm &amp; Download Receipt</>}
            </SubmitBtn>
          </SubmitRow>
        </form>
      </Modal>
    </Overlay>
  );
};

PaymentModal.propTypes = {
  member: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default PaymentModal;

const slideIn = keyframes`from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); }`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  animation: ${slideIn} 0.25s ease;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #1e1e1e;
  background: #141414;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 10px;
  i { color: #ff6b00; }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
  &:hover { color: #fff; }
`;

const MemberBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: rgba(255,107,0,0.06);
  border-bottom: 1px solid #1e1e1e;
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00, #ff8c3a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: #fff;
  flex-shrink: 0;
`;

const MemberName = styled.div`font-weight: 700; color: #fff; font-size: 0.9rem;`;
const MemberEmail = styled.div`color: #666; font-size: 0.78rem;`;

const FGroup = styled.div`padding: 0 20px; margin-bottom: 16px;`;
const FRow = styled.div`display: flex; gap: 14px; > * { flex: 1; }`;

const FLabel = styled.label`
  display: block;
  color: #888;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  margin-top: 16px;
`;

const FInput = styled.input`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  background: #0a0a0a;
  color: #fff;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus { outline: none; border-color: #ff6b00; }
  &::placeholder { color: #444; }
`;

const FSelect = styled.select`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  background: #0a0a0a;
  color: #fff;
  font-size: 0.9rem;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #ff6b00; }
  option { background: #0a0a0a; }
`;

const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const ModeBtn = styled.button`
  padding: 9px 6px;
  border: 1px solid ${p => p.$active ? "#ff6b00" : "#2a2a2a"};
  background: ${p => p.$active ? "rgba(255,107,0,0.12)" : "transparent"};
  color: ${p => p.$active ? "#ff8b35" : "#aaa"};
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  i { font-size: 1rem; }
  &:hover { border-color: #ff6b00; color: #fff; background:rgba(255,107,0,0.12); }
`;

const ErrorMsg = styled.p`
  color: #e74c3c;
  font-size: 0.85rem;
  padding: 0 20px;
  margin: 0 0 12px;
`;

const SubmitRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 14px 20px 20px;
  border-top: 1px solid #1e1e1e;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 10px;
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #888;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: border-color 0.2s;
  &:hover { border-color: #555; color: #fff; }
`;

const SubmitBtn = styled.button`
  flex: 2;
  padding: 10px;
  background: #ff6b00;
  border: none;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background 0.2s;
  &:hover:not(:disabled) { background: #e05e00; color:#fff; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
