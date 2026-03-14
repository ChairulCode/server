// utils/mailer.ts (Backend)
import nodemailer from "nodemailer";

interface EmailPayload {
	userEmail: string;
	studentName: string;
	regNo: string;
	status: string; // Status: pending (konfirmasi), approved, rejected (update status)
}

export const sendRegistrationNotif = async (payload: EmailPayload): Promise<void> => {
	const { userEmail, studentName, regNo, status } = payload;

	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.EMAIL_USER?.trim(),
			pass: process.env.EMAIL_PASSWORD?.trim()?.replace(/\s/g, ""),
		},
	});

	// =====================================================
	// LOGIKA KONTEN BERDASARKAN STATUS
	// =====================================================
	let emailSubject = "";
	let statusLabel = "";
	let statusColor = "";
	let statusIcon = "";
	let mainMessage = "";
	let nextStepsContent = "";
	let additionalInfo = "";

	switch (status.toLowerCase()) {
		case "pending":
			// =====================================================
			// EMAIL KONFIRMASI: Pendaftaran Diterima & Sedang Diproses
			// (Dikirim otomatis saat orang tua submit form)
			// =====================================================
			emailSubject = `Pendaftaran Berhasil Diterima - ${regNo}`;
			statusLabel = "PENDAFTARAN DITERIMA";
			statusColor = "#3b82f6"; // Biru (bukan kuning, karena ini konfirmasi positif)
			statusIcon = "✓";
			mainMessage = `
        Terima kasih telah mendaftarkan <strong>${studentName}</strong> di Perguruan WR Supratman 
        untuk tahun ajaran 2026/2027. 
        <br><br>
        Kami dengan senang hati menginformasikan bahwa <strong>pendaftaran Anda telah kami terima</strong> 
        dan saat ini sedang dalam tahap <strong>VERIFIKASI</strong> oleh tim kami.
      `;
			nextStepsContent = `
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 18px; margin: 25px 0; border-radius: 6px;">
          <h3 style="margin: 0 0 12px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
            📋 Informasi Proses Verifikasi
          </h3>
          <div style="color: #1e40af; font-size: 14px; line-height: 1.8;">
            <p style="margin: 0 0 10px 0;">
              <strong>Timeline Verifikasi:</strong>
            </p>
            <ul style="margin: 0 0 15px 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Proses verifikasi dokumen membutuhkan waktu <strong>3-5 hari kerja</strong></li>
              <li style="margin-bottom: 8px;">Tim kami akan menghubungi Anda jika ada dokumen yang perlu dilengkapi</li>
              <li style="margin-bottom: 8px;">Setelah verifikasi selesai, Anda akan menerima email pemberitahuan</li>
            </ul>
            <p style="margin: 0 0 10px 0;">
              <strong>Apa yang Perlu Anda Lakukan:</strong>
            </p>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Pastikan email Anda <strong>aktif</strong> dan periksa folder spam/junk secara berkala</li>
              <li style="margin-bottom: 8px;">Simpan nomor pendaftaran Anda: <strong>${regNo}</strong></li>
              <li style="margin-bottom: 8px;">Siapkan dokumen asli untuk verifikasi jika diperlukan</li>
              <li style="margin-bottom: 8px;"><strong>Tidak perlu</strong> menghubungi kami selama masa verifikasi, kecuali ada perubahan data penting</li>
            </ul>
          </div>
        </div>
      `;
			additionalInfo = `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px;">
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.6;">
            <strong>💡 Catatan Penting:</strong> Email ini adalah konfirmasi bahwa pendaftaran Anda telah masuk ke sistem kami. 
            Hasil akhir verifikasi (diterima/ditolak) akan diinformasikan melalui email terpisah setelah proses verifikasi selesai.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #475569; margin: 20px 0 10px 0;">
          Jika ada pertanyaan atau perubahan data mendesak, silakan hubungi kami:
        </p>
        <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; margin: 15px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>📞 Telepon</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: (061) 123-4567</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>📱 WhatsApp</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: 0812-3456-7890</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>📧 Email</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: admin@wrsupratman.sch.id</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569; vertical-align: top;"><strong>🏢 Alamat</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: Jl. WR Supratman No.1, Medan</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>🕐 Jam Operasional</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: Senin - Jumat, 08.00 - 15.00 WIB</td>
            </tr>
          </table>
        </div>
        <p style="font-size: 13px; color: #64748b; margin: 20px 0 0 0; font-style: italic; text-align: center;">
          Terima kasih atas kepercayaan Anda kepada Perguruan WR Supratman.
        </p>
      `;
			break;

		case "approved":
			// =====================================================
			// EMAIL UPDATE: Status Berubah menjadi DITERIMA
			// (Dikirim saat admin update status ke approved)
			// =====================================================
			emailSubject = `[DITERIMA] Hasil Verifikasi Pendaftaran - ${regNo}`;
			statusLabel = "DITERIMA";
			statusColor = "#10b981"; // Hijau
			statusIcon = "✓";
			mainMessage = `
        Kami dengan senang hati menginformasikan bahwa pendaftaran siswa atas nama 
        <strong>${studentName}</strong> telah <strong>DITERIMA</strong> di Perguruan WR Supratman 
        untuk tahun ajaran 2026/2027.
      `;
			nextStepsContent = `
        <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 18px; margin: 25px 0; border-radius: 6px;">
          <h3 style="margin: 0 0 12px 0; color: #065f46; font-size: 16px; font-weight: 600;">
            📋 Langkah Selanjutnya - DAFTAR ULANG
          </h3>
          <ol style="margin: 0; padding-left: 20px; color: #065f46; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 10px;">
              Silakan melakukan <strong>daftar ulang</strong> paling lambat <strong>7 hari kerja</strong> 
              sejak email ini diterima.
            </li>
            <li style="margin-bottom: 10px;">
              Harap membawa <strong>dokumen asli</strong> untuk verifikasi:
              <ul style="margin-top: 5px;">
                <li>Akte Kelahiran</li>
                <li>Kartu Keluarga</li>
                <li>Bukti Pembayaran Formulir</li>
              </ul>
            </li>
            <li style="margin-bottom: 10px;">
              Hubungi bagian administrasi untuk informasi biaya pendaftaran ulang.
            </li>
          </ol>
        </div>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px;">
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.6;">
            <strong>⚠️ PENTING:</strong> Jika tidak melakukan daftar ulang dalam waktu yang ditentukan, 
            kursi akan diberikan kepada calon siswa lainnya.
          </p>
        </div>
      `;
			additionalInfo = `
        <p style="font-size: 14px; color: #475569; margin: 20px 0 10px 0;">
          Untuk informasi lebih lanjut mengenai jadwal daftar ulang, biaya, dan persyaratan:
        </p>
        <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; margin: 15px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>📞 Telepon</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: (061) 123-4567</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>📱 WhatsApp</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: 0812-3456-7890</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>📧 Email</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: admin@wrsupratman.sch.id</td>
            </tr>
          </table>
        </div>
      `;
			break;

		case "rejected":
			// =====================================================
			// EMAIL UPDATE: Status Berubah menjadi DITOLAK
			// (Dikirim saat admin update status ke rejected)
			// =====================================================
			emailSubject = `[INFORMASI] Hasil Verifikasi Pendaftaran - ${regNo}`;
			statusLabel = "BELUM DAPAT DITERIMA";
			statusColor = "#ef4444"; // Merah
			statusIcon = "ℹ";
			mainMessage = `
        Terima kasih atas minat Anda untuk mendaftarkan <strong>${studentName}</strong> 
        di Perguruan WR Supratman. 
        <br><br>
        Setelah melalui proses seleksi dan evaluasi, kami mohon maaf untuk saat ini 
        pendaftaran <strong>belum dapat kami terima</strong>.
      `;
			nextStepsContent = `
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 18px; margin: 25px 0; border-radius: 6px;">
          <h3 style="margin: 0 0 12px 0; color: #991b1b; font-size: 16px; font-weight: 600;">
            ℹ️ Informasi Penting
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #991b1b; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 10px;">
              Keputusan ini berdasarkan berbagai pertimbangan, termasuk kapasitas kelas yang terbatas.
            </li>
            <li style="margin-bottom: 10px;">
              Anda dapat mendaftar kembali pada periode pendaftaran berikutnya.
            </li>
            <li style="margin-bottom: 10px;">
              Dokumen pendaftaran dapat diambil kembali di kantor administrasi.
            </li>
          </ul>
        </div>
      `;
			additionalInfo = `
        <p style="font-size: 14px; color: #475569; margin: 20px 0 10px 0;">
          Kami sangat menghargai kepercayaan Anda kepada Perguruan WR Supratman. 
          Jika ada pertanyaan lebih lanjut, silakan hubungi kami:
        </p>
        <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; margin: 15px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>📞 Telepon</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: (061) 123-4567</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>📱 WhatsApp</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: 0812-3456-7890</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;"><strong>📧 Email</strong></td>
              <td style="padding: 5px 0; font-size: 14px; color: #1e293b;">: admin@wrsupratman.sch.id</td>
            </tr>
          </table>
        </div>
        <p style="font-size: 13px; color: #64748b; margin: 25px 0 0 0; font-style: italic; text-align: center;">
          Kami mendoakan yang terbaik untuk masa depan pendidikan ${studentName}.
        </p>
      `;
			break;

		default:
			// Fallback (seharusnya tidak terjadi)
			emailSubject = `Update Pendaftaran - ${regNo}`;
			statusLabel = "INFORMASI";
			statusColor = "#64748b";
			statusIcon = "ℹ";
			mainMessage = `Terdapat update terkait pendaftaran ${studentName}.`;
			nextStepsContent = "";
			additionalInfo = "";
	}

	// =====================================================
	// TEMPLATE EMAIL HTML
	// =====================================================
	const mailOptions = {
		from: `"Panitia PSB WR Supratman" <${process.env.EMAIL_USER}>`,
		to: userEmail,
		subject: emailSubject,
		html: `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- HEADER -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
              Perguruan WR Supratman
            </h1>
            <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 14px;">
              Penerimaan Siswa Baru Tahun Ajaran 2026/2027
            </p>
          </div>

          <!-- BODY -->
          <div style="padding: 35px 30px;">
            
            <!-- GREETING -->
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">
              Kepada Yth. Orang Tua/Wali Siswa,
            </h2>
            
            <!-- STATUS CARD -->
            <div style="background-color: #f8fafc; border: 2px solid ${statusColor}; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <div style="text-align: center; margin-bottom: 15px;">
                <span style="display: inline-block; background-color: ${statusColor}; color: white; padding: 10px 24px; border-radius: 25px; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
                  ${statusIcon} ${statusLabel}
                </span>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 45%;">Nomor Pendaftaran</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 15px; font-weight: bold;">: ${regNo}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Nama Siswa</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 15px; font-weight: bold;">: ${studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Status</td>
                  <td style="padding: 8px 0;">
                    <span style="color: ${statusColor}; font-weight: bold; font-size: 15px;">: ${statusLabel}</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- MAIN MESSAGE -->
            <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 25px 0;">
              ${mainMessage}
            </p>

            <!-- NEXT STEPS -->
            ${nextStepsContent}

            <!-- CONTACT INFORMATION -->
            ${additionalInfo}

          </div>

          <!-- FOOTER -->
          <div style="background-color: #f8fafc; padding: 25px 30px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b; text-align: center;">
              Email ini dikirim secara otomatis dari Sistem Informasi PSB WR Supratman.
            </p>
            <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
              Mohon tidak membalas email ini. Untuk pertanyaan, silakan hubungi kontak di atas.
            </p>
            <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                © 2026 Perguruan WR Supratman 1, Medan | 
                <a href="https://wrsupratman.sch.id" style="color: #3b82f6; text-decoration: none;">wrsupratman.sch.id</a>
              </p>
            </div>
          </div>

        </div>

        <!-- SPACER FOR MOBILE -->
        <div style="height: 20px;"></div>

      </body>
      </html>
    `,
	};

	// =====================================================
	// SEND EMAIL
	// =====================================================
	await transporter.sendMail(mailOptions);
};
