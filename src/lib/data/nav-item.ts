"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface MegaMenuResponse {
  megaMenus: MegaMenu[]
}

export interface MegaMenu {
  id: string
  title: string
  handle: string
  type: string
  category_id: string | null
  brand_id: string | null
  custom_link: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  items: MegaMenuItem[]
}

export interface MegaMenuItem {
  id: string
  title: string
  link: string | null
  sort_order: number
  is_active: boolean
  type: string
  category_id: string | null
  brand_id: string | null
  custom_link: string | null
  product_id: string | null
  parent_id: string | null
  parent: MegaMenuParent | null
  menu_id: string
  menu: MegaMenuRef
  created_at: string
  updated_at: string
  deleted_at: string | null
  children?: MegaMenuItem[] // recursive nesting
}

export interface MegaMenuParent {
  id: string
}

export interface MegaMenuRef {
  id: string
}

/**
 * Fetches the full mega menu structure from the Medusa Store API
 */
export const getMenu = async (): Promise<MegaMenuResponse> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("mega-menu")),
  }

  try {
    const { megaMenus } = await sdk.client.fetch<MegaMenuResponse>(
      `/store/mega-menu`,
      {
        method: "GET",
        headers,
        next,
        cache: "force-cache",
      }
    )

    return { megaMenus }
  } catch (error) {
    console.error("Failed to fetch mega menu:", error)
    return { megaMenus: [] }
  }
}

// // Horizontal menu categories
// export const categories = [
//   { name: 'Τρόφιμα', handle: 'trofia' },
//   { name: 'Προσωπική Φροντίδα', handle: 'prosopiki-frontida' },
//   { name: 'Μαμά-Παιδί', handle: 'mama-paidi' },
//   { name: 'Λάδυση & Διάιτα', handle: 'ladysi-diaita' },
//   { name: 'Υγεία-Ευεξία', handle: 'ygeia-evexia' },
//   { name: 'Αρωματοθεραπεία', handle: 'aromatotherapeia' },
//   { name: 'Προϊόντα Καθαρδής', handle: 'proionta-katharistis' },
//   { name: 'Είδη για το σπίτι', handle: 'eidi-gia-to-spiti' },
//   { name: 'Brands', handle: 'brands' },
//   { name: 'Blog', handle: 'blog' },
//   { name: 'Επικοινωνία', handle: 'epikoinonia' }
// ];
//
// export const menuData: { [key: string]: Array<{ title: string; handle: string; items: Array<{ name: string; handle: string }> }> } = {
//   'Τρόφιμα': [
//     // Column 1
//     {
//       title: 'Αρτοσκευάσματα',
//       handle: 'Αρτοσκευάσματα',
//       items: [
//         { name: 'Παξιμάδια & Ντακάκια', handle: 'Παξιμάδια-&-Ντακάκια' },
//         { name: 'Ψωμί', handle: 'Ψωμί' },
//         { name: 'Βάση για Πίτσα', handle: 'Βάση-για-Πίτσα' },
//         { name: 'Φρυγανιές-Κράκερς-Κριτσίνια', handle: 'Φρυγανιές-Κράκερς-Κριτσίνια' }
//       ]
//     },
//     {
//       title: 'Χυμοί-Ροφήματα-Νερό',
//       handle: 'Χυμοί-Ροφήματα-Νερό',
//       items: [
//         { name: 'Χυμοί', handle: 'Χυμοί' },
//         { name: 'Ροφήματα Φυτικά', handle: 'Ροφήματα-Φυτικά' },
//         { name: 'Νερό & Φίλτρα', handle: 'Νερό-&-Φίλτρα' },
//         { name: 'Kombucha - Τσάι', handle: 'Kombucha-Τσάι' }
//       ]
//     },
//     {
//       title: 'Ιαπωνική κουζίνα',
//       handle: 'Ιαπωνική-κουζίνα',
//       items: [
//         { name: 'Μακροβιοτικά', handle: 'Μακροβιοτικά' },
//         { name: 'Noodles', handle: 'Noodles' },
//         { name: 'Προϊόντα Σόγιας', handle: 'Προϊόντα-Σόγιας' }
//       ]
//     },
//     {
//       title: 'Πρωϊνό',
//       handle: 'Πρωϊνό',
//       items: [
//         { name: 'Πρωϊνό', handle: 'Πρωϊνό' },
//         { name: 'Μούσλι', handle: 'Μούσλι' },
//         { name: 'Γκρανόλα', handle: 'Γκρανόλα' },
//         { name: 'Πίτουρα & νιφάδες δημητριακών', handle: 'Πίτουρα-&-νιφάδες-δημητριακών' }
//       ]
//     },
//     // Column 2
//     {
//       title: 'Ζαχαροπλαστική & Μαγειρική',
//       handle: 'Ζαχαροπλαστική-&-Μαγειρική',
//       items: [
//         { name: 'Βοηθήματα ζαχαροπλαστικής', handle: 'Βοηθήματα-ζαχαροπλαστικής' },
//         { name: 'Βοηθήματα μαγειρικής', handle: 'Βοηθήματα-μαγειρικής' },
//         { name: 'Άλευρα', handle: 'Άλευρα' },
//         { name: 'Σάλτσες - Dressing', handle: 'Σάλτσες-Dressing' }
//       ]
//     },
//     {
//       title: 'Μελισσοκομικά προϊόντα',
//       handle: 'Μελισσοκομικά-προϊόντα',
//       items: [
//         { name: 'Μέλι', handle: 'Μέλι' },
//         { name: 'Γύρη', handle: 'Γύρη' },
//         { name: 'Πρόπολη', handle: 'Πρόπολη' },
//         { name: 'Βασιλικός Πολτός', handle: 'Βασιλικός-Πολτός' }
//       ]
//     },
//     {
//       title: 'Ζάχαρη & Γλυκαντικά',
//       handle: 'Ζάχαρη-&-Γλυκαντικά',
//       items: [
//         { name: 'Ζάχαρη', handle: 'Ζάχαρη' },
//         { name: 'Γλυκαντικά', handle: 'Γλυκαντικά' }
//       ]
//     },
//     {
//       title: 'Γλυκές γεύσεις',
//       handle: 'Γλυκές-γεύσεις',
//       items: [
//         { name: 'Γλυκές γεύσεις', handle: 'Γλυκές-γεύσεις' },
//         { name: 'Μπισκότα', handle: 'Μπισκότα' },
//         { name: 'Χαλβάς', handle: 'Χαλβάς' },
//         { name: 'Βάφλες', handle: 'Βάφλες' }
//       ]
//     },
//     // Column 3
//     {
//       title: 'Superfoods',
//       handle: 'Superfoods',
//       items: [
//         { name: 'Μούρα & Καρποί', handle: 'Μούρα-&-Καρποί' },
//         { name: 'Wellness Foods', handle: 'Wellness-Foods' },
//         { name: 'Προϊόντα Cacao', handle: 'Προϊόντα-Cacao' },
//         { name: 'Αμουβέρδα Βότανα & Ρίζες', handle: 'Αμουβέρδα-Βότανα-&-Ρίζες' },
//         { name: 'Super Greens (Σκόνες)', handle: 'Super-Greens-(Σκόνες)' },
//         { name: 'Φαρμακευτικά μανιτάρια', handle: 'Φαρμακευτικά-μανιτάρια' },
//         { name: 'Γλυκαντικά Low Gi', handle: 'Γλυκαντικά-Low-Gi' },
//         { name: 'Σπόροι -Super Seeds', handle: 'Σπόροι--Super-Seeds' }
//       ]
//     },
//     {
//       title: 'Υγιεινά Σνακ & Μπάρες ενέργειας',
//       handle: 'Υγιεινά-Σνακ-&-Μπάρες-ενέργειας',
//       items: [
//         { name: 'Χαρουπόλατες', handle: 'Χαρουπόλατες' },
//         { name: 'Καραμέλες & Πλεϊφατζούρια', handle: 'Καραμέλες-&-Πλεϊφατζούρια' },
//         { name: 'Ρυζο - Καλαμπο γκοφρέτες', handle: 'Ρυζο-Καλαμπο-γκοφρέτες' },
//         { name: 'Μπάρες Ενέργειας & Δημητριακών', handle: 'Μπάρες-Ενέργειας-&-Δημητριακών' },
//         { name: 'Σνακ & Τσιπς', handle: 'Σνακ-&-Τσιπς' }
//       ]
//     },
//     {
//       title: 'Λάδι - Ξύδι - Προϊόντα Ελιάς',
//       handle: 'Λάδι-Ξύδι-Προϊόντα-Ελιάς',
//       items: [
//         { name: 'Ξύδι', handle: 'Ξύδι' },
//         { name: 'Ελαια Σπόρων & Καρπών', handle: 'Ελαια-Σπόρων-&-Καρπών' },
//         { name: 'Προϊόντα Ελιάς', handle: 'Προϊόντα-Ελιάς' },
//         { name: 'Ελαιόλαδο', handle: 'Ελαιόλαδο' }
//       ]
//     },
//     // Column 4
//     {
//       title: 'Όσπρια-Ζυμαρικά-Ρύζι',
//       handle: 'Όσπρια-Ζυμαρικά-Ρύζι',
//       items: [
//         { name: 'Όσπρια', handle: 'Όσπρια' },
//         { name: 'Ζυμαρικά', handle: 'Ζυμαρικά' },
//         { name: 'Ρύζι', handle: 'Ρύζι' }
//       ]
//     },
//     {
//       title: 'Αλάτι-Μπαχαρικά',
//       handle: 'Αλάτι-Μπαχαρικά',
//       items: [
//         { name: 'Αλάτι', handle: 'Αλάτι' },
//         { name: 'Μπαχαρικά', handle: 'Μπαχαρικά' },
//         { name: 'Προϊόντα τρούφας-Μανιτάρια', handle: 'Προϊόντα-τρούφας-Μανιτάρια' },
//         { name: 'Μανιτάρια αποξηραμένα', handle: 'Μανιτάρια-αποξηραμένα' },
//         { name: 'Προϊόντα τρούφας', handle: 'Προϊόντα-τρούφας' }
//       ]
//     },
//     {
//       title: 'Προϊόντα τρούφας-Μανιτάρια',
//       handle: 'Προϊόντα-τρούφας-Μανιτάρια',
//       items: [
//         { name: 'Μανιτάρια αποξηραμένα', handle: 'Μανιτάρια-αποξηραμένα' },
//         { name: 'Προϊόντα τρούφας', handle: 'Προϊόντα-τρούφας' }
//       ]
//     },
//     {
//       title: 'Προϊόντα χωρίς Γλουτένη',
//       handle: 'Προϊόντα-χωρίς-Γλουτένη',
//       items: [
//         { name: 'Πρωϊνό', handle: 'Πρωϊνό' },
//         { name: 'Για παιδιά', handle: 'Για-παιδιά' },
//         { name: 'Αρτοσκευάσματα', handle: 'Αρτοσκευάσματα' },
//         { name: 'Αλμυρά Σνακ', handle: 'Αλμυρά-Σνακ' },
//         { name: 'Γλυκά Σνακ', handle: 'Γλυκά-Σνακ' },
//         { name: 'Άλευρα', handle: 'Άλευρα' },
//         { name: 'Μαγειρική & Ζαχαροπλαστική', handle: 'Μαγειρική-&-Ζαχαροπλαστική' },
//         { name: 'Ζυμαρικά & Noodles', handle: 'Ζυμαρικά-&-Noodles' },
//         { name: 'Προϊόντα από ρύζα KONJAK', handle: 'Προϊόντα-από-ρύζα-KONJAK' }
//       ]
//     },
//     // Column 5
//     {
//       title: 'Επαλείμματα',
//       handle: 'Επαλείμματα',
//       items: [
//         { name: 'Σοκολάτα', handle: 'Σοκολάτα' },
//         { name: 'Ταχίνι', handle: 'Ταχίνι' },
//         { name: 'Σπόροι & Καρποί', handle: 'Σπόροι-&-Καρποί' },
//         { name: 'Βούτυρα', handle: 'Βούτυρα' }
//       ]
//     },
//     {
//       title: 'Ξηροί καρποί & φρούτα-Δημητριακά Σπόροι',
//       handle: 'Ξηροί-καρποί-&-φρούτα-Δημητριακά-Σπόροι',
//       items: [
//         { name: 'Ξηροί καρποί', handle: 'Ξηροί-καρποί' },
//         { name: 'Ξερά Φρούτα', handle: 'Ξερά-Φρούτα' },
//         { name: 'Σπόροι - Δημητριακά', handle: 'Σπόροι-Δημητριακά' },
//         { name: 'Φύτρα', handle: 'Φύτρα' }
//       ]
//     },
//     {
//       title: 'Τσάι- Καφές & Ζεστά ροφήματα',
//       handle: 'Τσάι--Καφές-&-Ζεστά-ροφήματα',
//       items: [
//         { name: 'Βότανα θεραπευτικά', handle: 'Βότανα-θεραπευτικά' },
//         { name: 'Τσάι & Εγχυλίσματα', handle: 'Τσάι-&-Εγχυλίσματα' },
//         { name: 'Καφέδες & Υποκατάστατα Καφέ', handle: 'Καφέδες-&-Υποκατάστατα-Καφέ' }
//       ]
//     },
//     {
//       title: 'Κονσέρβες - Τουρσί - Κομπόστες',
//       handle: 'Κονσέρβες-Τουρσί-Κομπόστες',
//       items: [
//         { name: 'Κονσέρβες', handle: 'Κονσέρβες' },
//         { name: 'Τουρσί', handle: 'Τουρσί' },
//         { name: 'Κομπόστες', handle: 'Κομπόστες' }
//       ]
//     }
//   ]
// };
