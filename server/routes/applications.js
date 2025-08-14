const express = require('express');
const multer = require('multer');
const db = require('../models/db');
const router = express.Router();
const path = require('path');
const verifyRecruiter = require('../middleware/verifyRecruiter');
const verifyUser = require('../middleware/verifyUser');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + unique + ext);
  },
});

const upload = multer({ storage });


router.get("/my", verifyUser, async (req, res) => {
  console.log("🔥 /applications/my accessed. User ID:", req.user.id);
  const { id: applicantId } = req.user;

  try {
    const sql = `
      SELECT a.id, j.title, j.location, j.salary_min, j.salary_max,
             a.resume_file, a.status, a.applied_at
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.applicant_id = ?
      ORDER BY a.applied_at DESC
    `;
    const [rows] = await db.execute(sql, [applicantId]);

    const formatted = rows.map(app => ({
      id: app.id,
      title: app.title,
      location: app.location,
      salary: `${app.salary_min} - ${app.salary_max}`,
      resume_file: app.resume_file,
      status: app.status,
      applied_at: app.applied_at,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load your applications" });
  }
});


router.post('/:jobId', upload.single('resume'), async (req, res) => {
  const jobId = req.params.jobId;
  const { applicant_name, applicant_email } = req.body;
  const resumeFile = req.file.filename;

  if (!applicant_name || !applicant_email || !resumeFile) {
    return res.status(400).json({ msg: 'All fields required' });
  }

  try {
    const sql = `
      INSERT INTO applications (job_id, applicant_name, applicant_email, resume_file)
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(sql, [jobId, applicant_name, applicant_email, resumeFile]);

    res.status(201).json({ msg: 'Application submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error submitting application' });
  }
});

router.post('/apply/:jobId', verifyUser, upload.single('resume'), async (req, res) => {
  const jobId = req.params.jobId;
  const { id: applicantId } = req.user;

  const {
    applicant_name,
    applicant_email,
    phone,
    graduation_year,
    college,
    degree,
    branch,
    linkedin,
    github,
    pitch
  } = req.body;

  if (!req.file) return res.status(400).json({ msg: 'No resume uploaded' });
  if (!applicant_name || !applicant_email) {
    return res.status(400).json({ msg: 'Full name and email are required' });
  }

  const resumeFile = req.file.filename;
  const toNull = v => (v === undefined || v === '' ? null : v);

  try {
    await db.execute(
      `INSERT INTO applications
        (job_id, applicant_id, applicant_name, applicant_email, resume_file, phone, graduation_year, college, degree, branch, linkedin, github, pitch)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobId,
        applicantId,
        applicant_name,
        applicant_email,
        resumeFile,
        toNull(phone),
        toNull(graduation_year),
        toNull(college),
        toNull(degree),
        toNull(branch),
        toNull(linkedin),
        toNull(github),
        toNull(pitch),
      ]
    );

    res.status(200).json({ msg: 'Application submitted' });
  } catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ msg: 'Failed to submit application' });
  }
});


router.get('/:jobId', verifyRecruiter, async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const sql = `
      SELECT id, applicant_name, applicant_email,phone, resume_file, applied_at,status
      FROM applications
      WHERE job_id = ?
      ORDER BY applied_at DESC
    `;
    const [rows] = await db.execute(sql, [jobId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch applications' });
  }
});

router.patch('/:appId/status', verifyRecruiter, async (req, res) => {
  const { status } = req.body;
  const valid = ['Pending', 'Short-Listed', 'Rejected'];
  if (!valid.includes(status))
    return res.status(400).json({ msg: 'Invalid status value' });

  try {
    await db.execute('UPDATE applications SET status=? WHERE id=?', [
      status,
      req.params.appId,
    ]);
    res.json({ msg: 'Status updated', status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;
