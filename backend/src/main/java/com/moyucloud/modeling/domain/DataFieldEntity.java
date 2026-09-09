package com.moyucloud.modeling.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.*;

@Entity
@Table(name = "meta_field")
public class DataFieldEntity {
    @Id
    @Column(length = 26, columnDefinition = "char(26)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    private DataTableEntity table;

    @Column(nullable = false, length = 80)
    private String fieldCode;

    @Column(nullable = false, length = 30)
    private String fieldType;

    private boolean required;
    private int sortOrder;

    @Column(length = 80)
    private String dictionaryCode;

    protected DataFieldEntity() {}

    public DataFieldEntity(String c, String t, boolean r, int s) {
        fieldCode = c;
        fieldType = t;
        required = r;
        sortOrder = s;
    }

    @PrePersist
    void assign() {
        if (id == null) id = Ulid.next();
    }

    void setTable(DataTableEntity t) {
        table = t;
    }

    public String getId() {
        return id;
    }

    public String getFieldCode() {
        return fieldCode;
    }

    public String getFieldType() {
        return fieldType;
    }

    public boolean isRequired() {
        return required;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public String getDictionaryCode() {
        return dictionaryCode;
    }
    public void setDictionaryCode(String code) { this.dictionaryCode = code; }
}
