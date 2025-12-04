# Multi-Index Comparison Chart 📊

Interactive web-based chart for comparing up to 4 financial indices with percentage-based performance tracking from a baseline (0%). Built with Highcharts Stock and featuring advanced zoom capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-production-green.svg)

## 🌟 Features

- **Compare up to 4 indices simultaneously** - Select from 127+ Indian market indices
- **Percentage-based comparison** - All indices start at 0% baseline for fair comparison
- **Advanced zoom controls**:
  - Mouse wheel zoom
  - Click & drag selection
  - Bottom navigator with drag handles
  - Preset time period buttons (1m, 3m, 6m, YTD, 1y, All)
- **Category organization** - Indices grouped into Broad, Sectoral, Strategy, and Thematic
- **Interactive tooltips** - Shows actual price + percentage change
- **Dark mode support** - Toggle between light/dark themes
- **Selected indices display** - Visual tags with color coding
- **Responsive design** - Works on desktop and mobile devices

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/multi-index-chart.git
   cd multi-index-chart
   ```

2. **Start local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

4. **Select indices and explore**
   - Choose up to 4 indices from dropdown menus
   - Use zoom controls to explore time periods
   - Toggle dark mode for comfortable viewing

## 📦 Project Structure

```
multi-index-chart/
├── index.html                          # Main application
├── chart.js                            # Chart logic & calculations
├── Latest_Indices_rawdata_14112025.csv # Historical data (2005-2025)
├── highcharts-zoom-template.html       # Reusable zoom template
├── cursor-zoom-only.html               # Cursor zoom template
├── prepare_data.py                     # Data preparation script
├── README.md                           # This file
├── TECHNICAL_DOCUMENTATION.md          # Technical details
└── DEPLOYMENT_GUIDE.md                 # VPS deployment guide
```

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charting**: Highcharts Stock v11.x
- **Backend**: Python HTTP server (for local development)
- **Data Format**: CSV (Date, Index columns)

## 🎯 Key Formulas

### Percentage Change Calculation
```javascript
Percentage = ((Current Price - Base Price) / Base Price) × 100
```

**Example:**
- NIFTY 50 Start (29 Aug 2005): 2,782.13 → 0%
- NIFTY 50 End (8 Nov 2025): 38,366.88 → +1,279.16%

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete VPS deployment instructions including:
- GitHub repository setup
- Nginx configuration
- Systemd service setup
- SSL certificate installation

**Quick Deploy:**
```bash
python3 -m http.server 8001
```

## 📖 Documentation

- **[TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)** - Formulas, architecture, implementation
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete VPS deployment guide

## 🖱️ Zoom Features

1. **Mouse Wheel** - Scroll to zoom in/out
2. **Click & Drag** - Select area to zoom
3. **Navigator** - Drag blue handles at bottom
4. **Buttons** - 1m, 3m, 6m, YTD, 1y, All presets
5. **Double Click** - Reset zoom

## 🤝 Contributing

Contributions welcome! Please submit a Pull Request.

## 📝 License

MIT License - see LICENSE file for details.

---

**Made with ❤️ for financial data analysis**

⭐ Star this repo if you find it useful!
