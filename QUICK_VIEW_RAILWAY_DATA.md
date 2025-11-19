# ⚡ Quick Guide: Makita ang Data sa Railway

## 🎯 PINAKAMADALING PARAAN:

### **Via Railway Database Tab:**

1. **Railway Dashboard** → I-click ang **Postgres service**
2. **I-click ang "Database" tab**
3. **I-run ang query:**
   ```sql
   SELECT * FROM surveys;
   ```
4. **Makikita mo ang lahat ng survey responses!**

---

## 📊 USEFUL QUERIES:

**View All:**
```sql
SELECT * FROM surveys ORDER BY created_at DESC;
```

**View Specific Fields:**
```sql
SELECT name, email_address, school_year_graduated, is_employed 
FROM surveys;
```

**Count:**
```sql
SELECT COUNT(*) FROM surveys;
```

---

**Database Tab = Pinakamadali!** ✅








