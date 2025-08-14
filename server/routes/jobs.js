const express = require('express');
const router = express.Router();
const db = require('../models/db');
const verifyRecruiter = require('../middleware/verifyRecruiter');


router.post('/',verifyRecruiter, async (req, res) => {
  const { title, description, location,experience, salary_min, salary_max, skills ,job_type, company} = req.body;

  try {
    const sql = `
      INSERT INTO jobs (title, description, location, experience,salary_min,salary_max, skills, job_type, company, posted_by)
      VALUES (?, ?, ?, ?, ?, ?, ? , ? , ?, ?)
    `;
    const [result] = await db.execute(sql, [
      title,
      description,                                                                            
      location,
      experience,
      salary_min,
      salary_max,
      skills,
      job_type,
      company,
      req.user.id
    ]);

    res.status(201).json({ msg: 'Job posted successfully', jobId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error posting job' });
  }
});

router.get('/', async (req, res) => {
  const { location, jobType, company, keyword, salary_min, salary_max, sortBy } = req.query;
  let sql = `SELECT * FROM jobs WHERE 1=1`;
  const params = [];

  if (location) {
    sql += ` AND location LIKE ?`;
    params.push(`%${location}%`);
  }

  if (jobType) {
    sql += ` AND job_type = ?`;
    params.push(jobType);
  }

  if (company) {
    sql += ` AND company LIKE ?`;
    params.push(`%${company}%`);
  }

  if (keyword) {
    sql += ` AND (title LIKE ? OR skills LIKE ?)`;
    params.push(`%${keyword}%, %${keyword}%`);
  }

  if (salary_min) {
    sql += ` AND salary_min >= ?`;
    params.push(parseInt(salary_min));
  }

  if (salary_max) {
    sql += ` AND salary_max <= ?`;
    params.push(parseInt(salary_max));
  }

  if (sortBy === "salaryAsc") {
    sql += " ORDER BY salary ASC";
  } else if (sortBy === "salaryDesc") {
    sql += " ORDER BY salary DESC";
  } else {
    sql += " ORDER BY created_at DESC"; 
  }

  try {
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching jobs with filters' });
  }
});
router.get('/my-jobs', verifyRecruiter, async (req, res) => {
  try {
    const sql = `SELECT * FROM jobs WHERE posted_by = ? ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch your jobs' });
  }
});


router.put('/:id', verifyRecruiter, async (req, res) => {
  const { title, description, location, experience, salary_min, salary_max, skills, job_type, company } = req.body;

  try {
    
    const [check] = await db.execute('SELECT * FROM jobs WHERE id=?', [req.params.id]);
    if (check.length === 0)
      return res.status(404).json({ msg: 'Job not found' });
    if (check[0].posted_by !== req.user.id)
      return res.status(403).json({ msg: 'Forbidden' });

    const existingJob = check[0];

    const updatedTitle = title ?? existingJob.title;
    const updatedDescription = description ?? existingJob.description;
    const updatedLocation = location ?? existingJob.location;
    const updatedExperience = experience ?? existingJob.experience;
    const updatedSalaryMin = salary_min ?? existingJob.salary_min;
    const updatedSalaryMax = salary_max ?? existingJob.salary_max;
    const updatedSkills = skills ?? existingJob.skills;
    const updatedJobType = job_type ?? existingJob.job_type;
    const updatedCompany = company ?? existingJob.company;

    await db.execute(
      `UPDATE jobs
       SET title=?, description=?, location=?, experience=?, salary_min=?, salary_max=?, skills=?, job_type=?, company=?
       WHERE id=?`,
      [
        updatedTitle,
        updatedDescription,
        updatedLocation,
        updatedExperience,
        updatedSalaryMin,
        updatedSalaryMax,
        updatedSkills,
        updatedJobType,
        updatedCompany,
        req.params.id
      ]
    );

    res.json({ msg: 'Job updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});



router.delete('/:id', verifyRecruiter, async (req, res) => {
  try {
    const [check] = await db.execute('SELECT posted_by FROM jobs WHERE id=?', [
      req.params.id,
    ]);
    if (check.length === 0 || check[0].posted_by !== req.user.id)
      return res.status(403).json({ msg: 'Forbidden' });

    await db.execute('DELETE FROM jobs WHERE id=?', [req.params.id]);
    res.json({ msg: 'Job deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const jobId = req.params.id;

  try {
    const [rows] = await db.execute("SELECT * FROM jobs WHERE id = ?", [jobId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Job not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching job" });
  }
});

module.exports = router;