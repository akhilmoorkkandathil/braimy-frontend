import { AfterViewInit, Component, Input, OnInit, ViewChild ,SimpleChanges, OnChanges, Output,EventEmitter} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Column } from '../../../interfaces/table/table'; // Adjust the path as per your project

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
    standalone: false
})
export class TableComponent<T> implements OnInit, AfterViewInit, OnChanges {
  @Input() tableColumns: Array<Column> = [];
  @Input() tableData: Array<T> = [];
  @Input() actions: Array<string> = [];

  @Output() actionClicked = new EventEmitter<{ action: string, element: T }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource();

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.dataSource.data = this.tableData;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] && this.tableData) {
      this.dataSource.data = this.tableData;
    }
    if (changes['actions'] || changes['tableColumns']) {
      this.updateDisplayedColumns();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.tableColumns.map(c => c.columnDef);
    if (this.actions.length > 0 && !this.displayedColumns.includes('actions')) {
      this.displayedColumns.push('actions');
    }
  }

  performAction(action: string, element: T): void {
    this.actionClicked.emit({ action, element });
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'edit': return 'edit';
      case 'view': return  'visibility';
      case 'delete': return 'delete';
      case 'block': return 'lock_close';
      case 'unblock': return 'lock_open';
      case 'verify': return 'check_circle';
      case 'approve': return 'check_circle';
      case 'completed': return 'check_circle';
      default: return 'more_horiz';
    }
  }
}
