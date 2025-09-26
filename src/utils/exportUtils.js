// Export utilities for data analysis and reporting
import * as XLSX from 'xlsx';

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Optional array of column configurations
 */
export const exportToCSV = (data, filename = 'export', columns = null) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  let csvContent = '';
  
  // If columns are specified, use them; otherwise use all keys from first object
  const headers = columns 
    ? columns.map(col => col.header || col.key)
    : Object.keys(data[0]);
  
  // Add headers
  csvContent += headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(row => {
    const values = columns 
      ? columns.map(col => {
          let value = row[col.key];
          if (col.formatter && typeof col.formatter === 'function') {
            value = col.formatter(value, row);
          }
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        })
      : Object.values(row).map(value => {
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        });
    
    csvContent += values.join(',') + '\n';
  });
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to JSON format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {boolean} pretty - Whether to format JSON with indentation
 */
export const exportToJSON = (data, filename = 'export', pretty = true) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const jsonContent = pretty 
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(data);
  
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to Excel format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the Excel sheet
 * @param {Array} columns - Optional array of column configurations
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1', columns = null) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Process data based on columns configuration
  let processedData = data;
  if (columns) {
    processedData = data.map(row => {
      const processedRow = {};
      columns.forEach(col => {
        let value = row[col.key];
        if (col.formatter && typeof col.formatter === 'function') {
          value = col.formatter(value, row);
        }
        processedRow[col.header || col.key] = value;
      });
      return processedRow;
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Auto-size columns
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const colWidths = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        const cellLength = cell.v.toString().length;
        maxWidth = Math.max(maxWidth, cellLength);
      }
    }
    colWidths.push({ width: Math.min(maxWidth + 2, 50) });
  }
  worksheet['!cols'] = colWidths;
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export multiple sheets to Excel
 * @param {Array} sheets - Array of sheet objects with {name, data, columns}
 * @param {string} filename - Name of the file (without extension)
 */
export const exportMultiSheetExcel = (sheets, filename = 'export') => {
  if (!sheets || sheets.length === 0) {
    console.warn('No sheets to export');
    return;
  }

  const workbook = XLSX.utils.book_new();
  
  sheets.forEach(sheet => {
    if (!sheet.data || sheet.data.length === 0) return;
    
    let processedData = sheet.data;
    if (sheet.columns) {
      processedData = sheet.data.map(row => {
        const processedRow = {};
        sheet.columns.forEach(col => {
          let value = row[col.key];
          if (col.formatter && typeof col.formatter === 'function') {
            value = col.formatter(value, row);
          }
          processedRow[col.header || col.key] = value;
        });
        return processedRow;
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    
    // Auto-size columns
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length;
          maxWidth = Math.max(maxWidth, cellLength);
        }
      }
      colWidths.push({ width: Math.min(maxWidth + 2, 50) });
    }
    worksheet['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name || 'Sheet');
  });
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Generate analytics report with multiple data sections
 * @param {Object} reportData - Object containing different data sections
 * @param {string} filename - Name of the file (without extension)
 * @param {string} format - Export format ('csv', 'json', 'excel')
 */
export const exportAnalyticsReport = (reportData, filename = 'analytics-report', format = 'excel') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}-${timestamp}`;
  
  switch (format.toLowerCase()) {
    case 'csv':
      // For CSV, combine all data into one file with sections
      let combinedData = [];
      Object.keys(reportData).forEach(section => {
        if (reportData[section] && reportData[section].length > 0) {
          // Add section header
          combinedData.push({ section: `=== ${section.toUpperCase()} ===` });
          combinedData = combinedData.concat(reportData[section]);
          combinedData.push({}); // Empty row for separation
        }
      });
      exportToCSV(combinedData, fullFilename);
      break;
      
    case 'json':
      exportToJSON(reportData, fullFilename);
      break;
      
    case 'excel':
    default:
      // Create multiple sheets for Excel
      const sheets = Object.keys(reportData).map(section => ({
        name: section,
        data: reportData[section] || []
      }));
      exportMultiSheetExcel(sheets, fullFilename);
      break;
  }
};

/**
 * Column configurations for different data types
 */
export const columnConfigs = {
  referralPrograms: [
    { key: 'name', header: 'Program Name' },
    { key: 'status', header: 'Status' },
    { key: 'rewardType', header: 'Reward Type' },
    { key: 'rewardValue', header: 'Reward Value', formatter: (value) => `$${value}` },
    { key: 'totalReferrals', header: 'Total Referrals' },
    { key: 'totalRewards', header: 'Total Rewards', formatter: (value) => `$${value}` },
    { key: 'conversionRate', header: 'Conversion Rate', formatter: (value) => `${value}%` },
    { key: 'createdAt', header: 'Created Date', formatter: (value) => new Date(value).toLocaleDateString() }
  ],
  
  coupons: [
    { key: 'code', header: 'Coupon Code' },
    { key: 'type', header: 'Type' },
    { key: 'value', header: 'Value' },
    { key: 'status', header: 'Status' },
    { key: 'totalUses', header: 'Total Uses' },
    { key: 'totalRevenue', header: 'Total Revenue', formatter: (value) => `$${value}` },
    { key: 'conversionRate', header: 'Conversion Rate', formatter: (value) => `${value}%` },
    { key: 'expiryDate', header: 'Expiry Date', formatter: (value) => new Date(value).toLocaleDateString() }
  ],
  
  promotions: [
    { key: 'name', header: 'Campaign Name' },
    { key: 'type', header: 'Type' },
    { key: 'status', header: 'Status' },
    { key: 'priority', header: 'Priority' },
    { key: 'totalUses', header: 'Total Uses' },
    { key: 'totalRevenue', header: 'Total Revenue', formatter: (value) => `$${value}` },
    { key: 'conversionRate', header: 'Conversion Rate', formatter: (value) => `${value}%` },
    { key: 'impressions', header: 'Impressions' },
    { key: 'startDate', header: 'Start Date', formatter: (value) => new Date(value).toLocaleDateString() },
    { key: 'endDate', header: 'End Date', formatter: (value) => new Date(value).toLocaleDateString() }
  ]
};

/**
 * Filter data based on criteria
 * @param {Array} data - Array of objects to filter
 * @param {Object} filters - Filter criteria
 */
export const filterData = (data, filters) => {
  if (!data || !filters) return data;
  
  return data.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const itemValue = item[key];
      
      if (filterValue === null || filterValue === undefined || filterValue === '') {
        return true; // No filter applied
      }
      
      if (typeof filterValue === 'string') {
        return itemValue && itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      
      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue);
      }
      
      return itemValue === filterValue;
    });
  });
};

/**
 * Sort data by specified criteria
 * @param {Array} data - Array of objects to sort
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - 'asc' or 'desc'
 */
export const sortData = (data, sortBy, sortOrder = 'asc') => {
  if (!data || !sortBy) return data;
  
  return [...data].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Handle different data types
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};