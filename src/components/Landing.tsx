import { BRAND } from '../config'
import { Logo } from './Logo'
import { Orbit } from './Art'

const WAYS = [
  { id: 'tong-quan', ic: '紫', bg: '#e6efe6', fg: 'var(--green)', tag: 'Mệnh bàn', title: 'Lá số Tử Vi', text: 'Lập lá số trọn đời, xem 12 cung, đại vận và vận trình từng năm.', go: 'Soi gốc rễ' },
  { id: 'gieo-que', ic: '☰', bg: '#f6e7e2', fg: 'var(--red)', tag: 'Thời quẻ', title: 'Gieo quẻ', text: 'Đặt một câu hỏi, gieo Lục Hào kèm bàn Kỳ Môn giờ để tham khảo thời thế.', go: 'Ứng thời' },
  { id: 'la-ban', ic: '➤', bg: '#fbf3dd', fg: '#8a6a22', tag: 'Phương hướng', title: 'La bàn phong thủy', text: 'Xét hướng nhà, bàn làm việc, giường ngủ theo Bát Trạch và Huyền Không.', go: 'Thuận hướng' },
]

export function Landing({ onGo }: { onGo: (id: string) => void }) {
  return (
    <div className="landing">
      <section className="intro">
        <div>
          <div className="row" style={{ gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <div style={{ flex: 'none' }}><Logo size={52} /></div>
            <div><div className="eyebrow" style={{ color: 'var(--red)' }}>{BRAND.full}</div><div className="small">Cổ học ứng dụng · Miễn phí</div></div>
          </div>
          <h1>Lập lá số Tử Vi trọn đời <em>Luận 12 cung, xem vận hạn từng năm</em></h1>
          <p className="lead">Công cụ miễn phí giúp bạn xem lá số, đại vận, vận hạn, gieo quẻ và chọn hướng — tính toán theo phương pháp cổ học, trình bày bằng ngôn ngữ dễ hiểu.</p>
          <div className="row" style={{ gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="btn red" style={{ flex: 'none' }} onClick={() => onGo('form')}>☯ Lập lá số ngay</button>
            <button className="btn ghost" style={{ flex: 'none' }} onClick={() => onGo('gieo-que')}>Gieo một quẻ</button>
          </div>
        </div>
        <Orbit />
      </section>

      <section className="section">
        <div className="divider">Dẫn nhập</div>
        <div className="ways">
          <div className="section-title">
            <div className="eyebrow">Ba góc nhìn</div>
            <h2>Gốc – Thời – Hướng, ba lăng kính cho một đời người</h2>
            <p className="muted" style={{ maxWidth: 640, margin: '0 auto' }}>Lá số cho biết mình là ai, quẻ cho biết lúc này nên tiến hay lùi, la bàn cho biết đặt mình ở đâu cho thuận. Ba góc nhìn bổ sung cho nhau để mỗi lựa chọn thêm vững.</p>
          </div>
          <div className="grid3">
            {WAYS.map((w) => (
              <button key={w.id} className="way" onClick={() => onGo(w.id)}>
                <div className="row" style={{ alignItems: 'center' }}>
                  <div className="ic" style={{ background: w.bg, color: w.fg, flex: 'none' }}>{w.ic}</div>
                  <span className="label" style={{ textAlign: 'right' }}>{w.tag}</span>
                </div>
                <h3>{w.title}</h3>
                <div className="small" style={{ color: 'var(--ink)' }}>{w.text}</div>
                <div className="go" style={{ color: w.fg }}>{w.go} →</div>
              </button>
            ))}
          </div>
          <div className="ways-foot">“Biết gốc để vững lòng · Biết thời để tiến thoái · Biết hướng để thuận thế”</div>
        </div>
      </section>

      <section className="section">
        <div className="essay">
          <p className="big-quote">“Mệnh là cái khung, đời là bức tranh.”</p>
          <p>
            <b>{BRAND.full}</b> ra đời từ mong muốn đưa môn <b>Tử Vi cổ học</b> đến gần người đọc hôm nay: tính toán chính xác
            theo phương pháp truyền thống, trình bày gọn gàng và nói bằng ngôn ngữ đời thường. Toàn bộ quá trình an sao, định cục,
            chọn ngày hay lập quẻ đều chạy ngay trên máy của bạn và hoàn toàn miễn phí.
          </p>
          <p>
            Lá số không phải bản án. Một chính tinh sáng chưa chắc đã an nhàn, một sát tinh hay Tuần – Triệt cũng không hẳn là trắc trở.
            Điều đáng giá nhất là hiểu khuynh hướng của bản thân để biết lúc nào nên mạnh dạn, lúc nào nên dè dặt.
          </p>
          <div className="framed">
            Lá số giống như bản đồ địa hình: cho biết đâu là núi, đâu là sông.<br />
            Còn đi đường nào, đi nhanh hay chậm, vẫn là lựa chọn của mỗi người.
          </div>
          <p>
            Người xưa có câu <b>“Nhất mệnh, nhị vận, tam phong thủy, tứ tích âm đức, ngũ độc thư”</b>. Mệnh và vận là phần trời cho,
            nhưng phong thủy, việc thiện và sự học là phần mình tự vun đắp — đủ sức thay đổi cả cục diện.
          </p>
          <div className="side-quote">
            Hãy dùng lá số như một tấm gương để soi, không phải sợi dây để trói.<br />
            <b>Hiểu mình – Chọn đúng – Sống thiện.</b>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <div className="eyebrow">Đồng hành</div>
          <h2 className="script" style={{ fontSize: '2.4rem', fontWeight: 700 }}>Tùy duyên mà luận, tùy tâm mà giải</h2>
        </div>
        <div className="services">
          <div className="svc" style={{ textAlign: 'right' }}>
            <h3>Luận giải 1:1</h3>
            <p>Đọc lá số cùng bạn, gỡ những điểm còn băn khoăn<br />và cùng tìm hướng đi thực tế cho từng giai đoạn.</p>
            {BRAND.bookingUrl ? <a className="btn" href={BRAND.bookingUrl} target="_blank" rel="noreferrer">Đặt lịch</a> : <span className="chip">Sắp mở đặt lịch</span>}
          </div>
          <div className="diamond"><div>Trường<br />Cát</div></div>
          <div className="svc">
            <h3>Hợp tác</h3>
            <p>Dành cho người nghiên cứu, thầy luận giải<br />muốn có công cụ riêng cho thương hiệu của mình.</p>
            {BRAND.contactUrl ? <a className="btn red" href={BRAND.contactUrl} target="_blank" rel="noreferrer">Liên hệ</a> : <span className="chip">Thông tin liên hệ đang cập nhật</span>}
          </div>
        </div>
      </section>

      {BRAND.supportQr && (
        <section className="section">
          <div className="grid2" style={{ alignItems: 'center' }}>
            <div className="card center-text">
              <h2 className="script" style={{ fontSize: '2.2rem' }}>Gieo duyên tùy tâm</h2>
              <p className="serif" style={{ fontStyle: 'italic' }}>{BRAND.supportNote || 'Nếu công cụ giúp bạn thêm sáng tỏ, một chút ủng hộ sẽ giúp dự án tiếp tục miễn phí cho mọi người.'}</p>
            </div>
            <div className="card center-text">
              <img src={BRAND.supportQr} alt="Mã QR ủng hộ" style={{ width: 200, maxWidth: '100%' }} />
              {BRAND.supportOwner && <div className="serif" style={{ fontWeight: 700, color: 'var(--green)' }}>{BRAND.supportOwner}</div>}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export function Footer({ onClear }: { onClear?: () => void }) {
  return (
    <footer className="footer">
      <div className="script">{BRAND.full}</div>
      <div className="label" style={{ margin: '6px 0 12px' }}>Cổ học ứng dụng · Hoàn toàn miễn phí</div>
      <div className="serif" style={{ fontStyle: 'italic' }}>“Tâm hướng thiện thì vận tự chuyển, việc hợp đạo thì đời tự an.”</div>
      <div style={{ marginTop: 10 }}>© {BRAND.year} {BRAND.full}. Nội dung mang tính tham khảo.</div>
      {onClear && <button className="btn ghost sm" style={{ marginTop: 12 }} onClick={onClear}>Xóa dữ liệu đã nhập</button>}
    </footer>
  )
}
