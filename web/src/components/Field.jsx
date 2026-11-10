// Một ô nhập liệu: nhãn + input (hoặc children nếu cần ô tuỳ biến, vd. ô mật khẩu có nút Hiện/Ẩn).
export default function Field({ label, id, children, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {children || <input id={id} required {...props} />}
    </div>
  );
}
