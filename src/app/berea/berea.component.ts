import { Component, OnInit, ViewChild } from '@angular/core';
import { FormioResourceIndexComponent } from 'angular-formio/resource';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';


import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';


@Component({
  selector: 'app-berea',
  templateUrl: './berea.component.html',
  styleUrls: ['./berea.component.scss']
})
export class BereaComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  title = 'my-app';
  public data = [];
  public res: string[] = [];

  columnDefs = [
    { headerName: 'Status',width: 80, field: 'listingStatus',filter: 'agTextColumnFilter', },

    { headerName: 'Type', width: 80 ,field: 'listingType', filter: 'agTextColumnFilter', },
    { headerName: 'Created', width: 100 ,field: 'createdTime', filter: 'agDateColumnFilter', cellRenderer: (data) => {
      return data.value ? (new Date(data.value)).toLocaleDateString() : '';
  }, sortable: true },
  { headerName: 'Updated', width: 100 ,field: 'lastUpdated', filter: 'agDateColumnFilter', cellRenderer: (data) => {
    return data.value ? (new Date(data.value)).toLocaleDateString() : '';
}, sortable: true },
    { headerName: 'Primary Property Practitioner',width: 160, field: 'primaryProperty',filter: 'agTextColumnFilter', },
    { headerName: 'Property Type', width: 120, field: 'propertyType',filter: 'agTextColumnFilter', },
    { headerName: 'Price', width: 120, field: 'price',filter: 'agNumberColumnFilter', },
    { headerName: 'Suburb', width: 140, field: 'suburb',filter: 'agTextColumnFilter', },
    { headerName: 'Address', width: 180, field: 'address',filter: 'agTextColumnFilter', },
    { headerName: 'No. Of Bedrooms', width: 80, field: 'bedrooms',filter: 'agNumberColumnFilter', },
    { headerName: 'Unit Number', width: 80, field: 'unitNumber' },
    { headerName: 'Scheme Name', width: 120, field: 'sectionalSchemeName', filter: 'agTextColumnFilter', },
    { headerName: 'Code', width: 80, field: 'code',filter: 'agTextColumnFilter', }
  ];



  rowData: any;
  

  constructor(private http: HttpClient, private router: Router) {

  }

  gridOptions: {
    // enables pagination in the grid
    pagination: true,

    // sets 10 rows per page (default is 100)
    paginationPageSize: 17,

    // other options
}
public a = 'active';
public firstName :any;
public lastName :any;

onRowClicked(event) {
  const url = window.location.href;
  window.open(`/#/residential/${event.data.id}/view`, '_blank');
  }

  newListing(){
    this.router.navigate([`/residential/new`]);
  }
  myListing(){
    this.gridData(`${this.firstName+this.lastName}`);
  }
  clearFilters() {
    this.ngOnInit();
  }
  gridData(a){

    let headers = new HttpHeaders().set('x-token', 'C7rBtDpCVAXqjx4RPOjD2jpe0Xati6')
    .set('content-type', 'application/json');

  this.http
    .get<any[]>('https://whitefang-digitaloffice.form.io/residentials1/submission?data.user.data.office._id=5e39ee247827cdd073865778&sort=-created&skip=0&limit=1000', { headers })
    .subscribe((res) => {
      this.data = [];

      res.forEach(element => {
        let userName = `${element.data.user.data.firstName+element.data.user.data.lastName?element.data.user.data.firstName+element.data.user.data.lastName:''}`;
          if(a == element.data.listingStatus || a == userName){
        return this.data.push({
          "address": element.data.address.formatted_address,
          "listingType": element.data.listingType,
          "propertyType": element.data.propertyType.data.label,
          "primaryProperty": element.data.user.data?element.data.user.data.firstName+" "+element.data.user.data.lastName:'',
          "price": element.data.price,
          "suburb": element.data.suburbRef.data.suburb,
          "bedrooms": element.data.bedrooms,
          "unitNumber": element.data.unitNumber ? element.data.unitNumber : '',
          "sectionalSchemeName": element.data.sectionalSchemeName,
          "code": element.data.mandateMetaData.code,
          "id": element._id,
          "listingStatus": element.data.listingStatus,
          "createdTime": element.data.createdTime?element.data.createdTime:element.created,
          "lastUpdated": element.data.lastUpdated
        });
      }
      });
      this.rowData = this.data;
    })

  }
  ngOnInit() {
    this.gridData(this.a);
  }


}

