# Code Review: Mix-Blend-Mode Issue Analysis

## Problem
The `mix-blend-mode: difference` is not working on header elements. Text remains white instead of inverting against the hero background.

## Root Causes Identified

### 1. **Stacking Context Isolation** ⚠️ CRITICAL
The header is `position: fixed` with `z-index: 1000`, creating a **new stacking context** that isolates it from elements below.

**Current Structure:**
```css
.header {
    position: fixed;      /* Creates new stacking context */
    z-index: 1000;       /* Above everything */
}

.hero-bg {
    z-index: 0;          /* Below header */
}
```

**Problem:** Fixed elements with z-index create isolated stacking contexts. The header can't "see" the hero background to blend with it - it only sees what's in its own context or the page background.

### 2. **Background Property Creating Stacking Context**
```css
.header-content {
    background-color: transparent;  /* Can create stacking context */
}
```

Even `transparent` backgrounds can create stacking contexts in some browsers, preventing blend modes from working.

### 3. **Blend Mode Applied to Wrong Level**
Blend mode is applied to individual text elements, but they're inside containers that may be creating isolation barriers.

## Solutions

### Solution 1: Remove Background Property (Quick Fix)
Remove `background-color` from `.header-content` entirely, or use `background: none`.

### Solution 2: Apply Blend Mode to Parent Container
Apply `mix-blend-mode: difference` to `.header` or `.header-content` instead of individual elements, so the entire header blends as one unit.

### Solution 3: Restructure Stacking Context (Best Solution)
Move the header inside the hero's stacking context, or use a different approach where the header can blend with the hero background.

## Recommended Fix

Apply blend mode to the parent container and ensure no background properties create isolation:

```css
.header {
    position: fixed;
    z-index: 1000;
    background: none;  /* Remove any background */
    mix-blend-mode: difference;  /* Apply to parent */
}

.header-content {
    background: none;  /* Not transparent, but none */
    /* Remove background-color entirely */
}
```

Then remove `mix-blend-mode` from individual child elements since the parent will handle blending.

