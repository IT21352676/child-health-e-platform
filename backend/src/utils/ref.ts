export const generateReferenceNumber = (): string => {
  // Simple, unique-ish reference: REF-<YYYYMMDD>-<timestamp>-<rand4>
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const ts = d.getTime();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `REF-${y}${m}${day}-${ts}-${rand}`;
};

export const generateQrCodeData = (appointmentId: string): string => {
  // For now, return a check-in URL pattern; frontend or official portal can read this
  return `https://app.local/checkin?appointmentId=${encodeURIComponent(appointmentId)}`;
};
